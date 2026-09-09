/**
 * Live bus position, all in one place.
 *
 * `subscribeToBus` is the ONLY way any screen may learn where a bus is.
 * Today it drives a timer-based simulator that interpolates the bus between
 * stops; swapping to a real backend (websocket, polling, whatever) later
 * means rewriting the inside of this file only — every screen already
 * subscribes instead of computing a position itself.
 */
import { getBus, getStopsForRoute, type Stop } from "@/data/mock";

export type BusStatus = "not_started" | "en_route" | "at_stop" | "finished";

export type BusPosition = {
  busId: string;
  latitude: number;
  longitude: number;
  headingDeg: number;
  speedKph: number;
  nextStopIndex: number;
  etaSeconds: number;
  status: BusStatus;
  updatedAt: string; // ISO datetime
};

type Listener = (position: BusPosition) => void;

const TICK_MS = 1000;
const LEG_DURATION_MS = 32_000; // simulated travel time between adjacent stops
const DWELL_MS = 6_000; // how long the bus sits "at_stop"
const START_DELAY_MS = 4_000; // "not_started" grace period before the first leg

/** Average seconds per leg, used only to project ETA to stops further down the route. */
export const ROUTE_LEG_SECONDS = LEG_DURATION_MS / 1000;

type SimState = {
  busId: string;
  stopList: Stop[];
  legStartedAt: number;
  fromIndex: number;
  toIndex: number;
  phase: "waiting" | "moving" | "dwelling" | "done";
  listeners: Set<Listener>;
  timer: ReturnType<typeof setInterval> | null;
  latest: BusPosition;
};

const sims = new Map<string, SimState>();

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function haversineMeters(a: Stop, b: Stop): number {
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function bearingDeg(a: Stop, b: Stop): number {
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buildPosition(sim: SimState, now: number): BusPosition {
  const { stopList, fromIndex, toIndex, phase } = sim;
  const from = stopList[fromIndex];
  const to = stopList[toIndex];

  if (phase === "waiting") {
    const remaining = Math.max(
      0,
      START_DELAY_MS - (now - sim.legStartedAt),
    );
    return {
      busId: sim.busId,
      latitude: from.latitude,
      longitude: from.longitude,
      headingDeg: stopList.length > 1 ? bearingDeg(from, stopList[1]) : 0,
      speedKph: 0,
      nextStopIndex: 0,
      etaSeconds: Math.ceil(remaining / 1000),
      status: "not_started",
      updatedAt: new Date(now).toISOString(),
    };
  }

  if (phase === "done") {
    const last = stopList[stopList.length - 1];
    return {
      busId: sim.busId,
      latitude: last.latitude,
      longitude: last.longitude,
      headingDeg: sim.latest.headingDeg,
      speedKph: 0,
      nextStopIndex: stopList.length - 1,
      etaSeconds: 0,
      status: "finished",
      updatedAt: new Date(now).toISOString(),
    };
  }

  if (phase === "dwelling") {
    const remaining = Math.max(0, DWELL_MS - (now - sim.legStartedAt));
    return {
      busId: sim.busId,
      latitude: from.latitude,
      longitude: from.longitude,
      headingDeg: sim.latest.headingDeg,
      speedKph: 0,
      nextStopIndex: fromIndex,
      etaSeconds: Math.ceil(remaining / 1000),
      status: "at_stop",
      updatedAt: new Date(now).toISOString(),
    };
  }

  // moving
  const elapsed = now - sim.legStartedAt;
  const t = Math.min(1, elapsed / LEG_DURATION_MS);
  const latitude = lerp(from.latitude, to.latitude, t);
  const longitude = lerp(from.longitude, to.longitude, t);
  const distanceMeters = haversineMeters(from, to);
  const speedKph = Math.max(
    0,
    (distanceMeters / (LEG_DURATION_MS / 1000)) * 3.6 +
      (Math.sin(now / 4000) * 2.5 + 2.5),
  );
  const remainingMs = Math.max(0, LEG_DURATION_MS - elapsed);

  return {
    busId: sim.busId,
    latitude,
    longitude,
    headingDeg: bearingDeg(from, to),
    speedKph: Math.round(speedKph * 10) / 10,
    nextStopIndex: toIndex,
    etaSeconds: Math.ceil(remainingMs / 1000),
    status: "en_route",
    updatedAt: new Date(now).toISOString(),
  };
}

function advance(sim: SimState, now: number): void {
  if (sim.phase === "waiting" && now - sim.legStartedAt >= START_DELAY_MS) {
    sim.phase = "moving";
    sim.legStartedAt = now;
  } else if (
    sim.phase === "moving" &&
    now - sim.legStartedAt >= LEG_DURATION_MS
  ) {
    sim.fromIndex = sim.toIndex;
    if (sim.fromIndex >= sim.stopList.length - 1) {
      sim.phase = "done";
    } else {
      sim.phase = "dwelling";
      sim.legStartedAt = now;
    }
  } else if (
    sim.phase === "dwelling" &&
    now - sim.legStartedAt >= DWELL_MS
  ) {
    sim.toIndex = sim.fromIndex + 1;
    sim.phase = "moving";
    sim.legStartedAt = now;
  }
}

function tick(sim: SimState): void {
  const now = Date.now();
  advance(sim, now);
  sim.latest = buildPosition(sim, now);
  for (const listener of sim.listeners) listener(sim.latest);
}

function createSim(busId: string): SimState | null {
  const bus = getBus(busId);
  if (!bus) return null;
  const stopList = getStopsForRoute(bus.routeId);
  if (stopList.length < 2) return null;

  const now = Date.now();
  const sim: SimState = {
    busId,
    stopList,
    legStartedAt: now,
    fromIndex: 0,
    toIndex: 1,
    phase: "waiting",
    listeners: new Set(),
    timer: null,
    latest: {
      busId,
      latitude: stopList[0].latitude,
      longitude: stopList[0].longitude,
      headingDeg: bearingDeg(stopList[0], stopList[1]),
      speedKph: 0,
      nextStopIndex: 0,
      etaSeconds: Math.ceil(START_DELAY_MS / 1000),
      status: "not_started",
      updatedAt: new Date(now).toISOString(),
    },
  };
  sim.timer = setInterval(() => tick(sim), TICK_MS);
  return sim;
}

/**
 * Subscribe to a bus's live position. Call the returned function to
 * unsubscribe. Multiple subscribers to the same bus share one simulation,
 * so every screen watching a bus sees the same position at the same time.
 */
export function subscribeToBus(
  busId: string,
  onUpdate: (position: BusPosition) => void,
): () => void {
  let sim = sims.get(busId);
  if (!sim) {
    const created = createSim(busId);
    if (!created) {
      return () => {};
    }
    sim = created;
    sims.set(busId, sim);
  }

  sim.listeners.add(onUpdate);
  onUpdate(sim.latest);

  return () => {
    const active = sims.get(busId);
    if (!active) return;
    active.listeners.delete(onUpdate);
    if (active.listeners.size === 0 && active.timer) {
      clearInterval(active.timer);
      sims.delete(busId);
    }
  };
}

/**
 * Project the ETA to a stop further down the route than the bus's
 * immediate next stop, using the known position and the route's average
 * leg duration. Pure function of already-fetched data — it derives a
 * number from a BusPosition, it does not compute the bus's position.
 */
export function projectedEtaSeconds(
  position: BusPosition,
  targetStopIndex: number,
): number {
  if (position.status === "finished") return 0;
  const legsAway = targetStopIndex - position.nextStopIndex;
  if (legsAway < 0) return 0;
  if (legsAway === 0) return position.etaSeconds;
  return position.etaSeconds + legsAway * ROUTE_LEG_SECONDS;
}
