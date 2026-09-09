/**
 * Mock data standing in for future database tables. Shapes mirror what the
 * real backend will return so swapping the queries later is mechanical —
 * screens should never need to change when this file is replaced.
 */

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Stop = Coordinate & {
  id: string;
  routeId: string;
  sequence: number;
  name: string;
};

export type Route = {
  id: string;
  name: string;
  stopIds: string[];
};

export type Bus = {
  id: string;
  routeId: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
};

export type Student = {
  id: string;
  parentId: string;
  name: string;
  grade: string;
  initials: string;
  busId: string;
  stopId: string;
};

export type AttendanceStatus = "waiting" | "boarded" | "absent" | "dropped_off";

export type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string; // ISO date, e.g. 2026-09-09
  status: AttendanceStatus;
  markedAt: string | null; // ISO datetime
};

export type TripStopEvent = {
  stopId: string;
  arrivedAt: string; // ISO datetime
};

export type Trip = {
  id: string;
  busId: string;
  date: string; // ISO date
  startedAt: string; // ISO datetime
  endedAt: string | null; // ISO datetime
  direction: "pickup" | "dropoff";
  stopEvents: TripStopEvent[];
};

export type Message = {
  id: string;
  busId: string;
  senderId: string;
  senderName: string;
  senderRole: "driver" | "parent" | "school";
  body: string;
  sentAt: string; // ISO datetime
};

export type EmergencyContact = {
  id: string;
  name: string;
  role: string;
  phone: string;
};

// ---------------------------------------------------------------------------
// Route: Gwarinpa south to Jabi, five stops
// ---------------------------------------------------------------------------

export const routes: Route[] = [
  {
    id: "route-1",
    name: "Gwarinpa – Jabi Express",
    stopIds: ["stop-1", "stop-2", "stop-3", "stop-4", "stop-5"],
  },
];

export const stops: Stop[] = [
  {
    id: "stop-1",
    routeId: "route-1",
    sequence: 0,
    name: "Gwarinpa Estate Gate",
    latitude: 9.107,
    longitude: 7.406,
  },
  {
    id: "stop-2",
    routeId: "route-1",
    sequence: 1,
    name: "3rd Avenue Junction",
    latitude: 9.096,
    longitude: 7.4145,
  },
  {
    id: "stop-3",
    routeId: "route-1",
    sequence: 2,
    name: "Life Camp Roundabout",
    latitude: 9.085,
    longitude: 7.422,
  },
  {
    id: "stop-4",
    routeId: "route-1",
    sequence: 3,
    name: "Jabi Lake Mall",
    latitude: 9.068,
    longitude: 7.4335,
  },
  {
    id: "stop-5",
    routeId: "route-1",
    sequence: 4,
    name: "Jabi Motor Park",
    latitude: 9.058,
    longitude: 7.44,
  },
];

export const buses: Bus[] = [
  {
    id: "bus-1",
    routeId: "route-1",
    plateNumber: "ABJ 442 KJ",
    driverName: "Emeka Obi",
    driverPhone: "+2348031234567",
    capacity: 18,
  },
];

export const students: Student[] = [
  {
    id: "student-1",
    parentId: "parent-1",
    name: "Amara Okafor",
    grade: "Primary 4",
    initials: "AO",
    busId: "bus-1",
    stopId: "stop-2",
  },
  {
    id: "student-2",
    parentId: "parent-1",
    name: "Chidi Okafor",
    grade: "Primary 2",
    initials: "CO",
    busId: "bus-1",
    stopId: "stop-2",
  },
];

const today = new Date().toISOString().slice(0, 10);

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "attendance-1",
    studentId: "student-1",
    date: today,
    status: "waiting",
    markedAt: null,
  },
  {
    id: "attendance-2",
    studentId: "student-2",
    date: today,
    status: "waiting",
    markedAt: null,
  },
];

export const trips: Trip[] = [
  {
    id: "trip-1",
    busId: "bus-1",
    date: daysAgo(1),
    direction: "pickup",
    startedAt: `${daysAgo(1)}T06:32:00.000Z`,
    endedAt: `${daysAgo(1)}T07:14:00.000Z`,
    stopEvents: stops.map((stop, i) => ({
      stopId: stop.id,
      arrivedAt: `${daysAgo(1)}T06:${(32 + i * 9).toString().padStart(2, "0")}:00.000Z`,
    })),
  },
  {
    id: "trip-2",
    busId: "bus-1",
    date: daysAgo(1),
    direction: "dropoff",
    startedAt: `${daysAgo(1)}T14:05:00.000Z`,
    endedAt: `${daysAgo(1)}T14:48:00.000Z`,
    stopEvents: stops.map((stop, i) => ({
      stopId: stop.id,
      arrivedAt: `${daysAgo(1)}T14:${(5 + i * 9).toString().padStart(2, "0")}:00.000Z`,
    })),
  },
  {
    id: "trip-3",
    busId: "bus-1",
    date: daysAgo(2),
    direction: "pickup",
    startedAt: `${daysAgo(2)}T06:29:00.000Z`,
    endedAt: `${daysAgo(2)}T07:10:00.000Z`,
    stopEvents: stops.map((stop, i) => ({
      stopId: stop.id,
      arrivedAt: `${daysAgo(2)}T06:${(29 + i * 9).toString().padStart(2, "0")}:00.000Z`,
    })),
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const messages: Message[] = [
  {
    id: "message-1",
    busId: "bus-1",
    senderId: "driver-1",
    senderName: "Emeka Obi",
    senderRole: "driver",
    body: "Good morning! Leaving the depot now, on schedule.",
    sentAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "message-2",
    busId: "bus-1",
    senderId: "parent-1",
    senderName: "You",
    senderRole: "parent",
    body: "Thank you, we'll be at the gate.",
    sentAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "message-3",
    busId: "bus-1",
    senderId: "driver-1",
    senderName: "Emeka Obi",
    senderRole: "driver",
    body: "Running about 5 minutes behind because of traffic at Life Camp.",
    sentAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
];

export const emergencyContacts: EmergencyContact[] = [
  {
    id: "contact-1",
    name: "Emeka Obi",
    role: "Bus driver",
    phone: "+2348031234567",
  },
  {
    id: "contact-2",
    name: "Transport office",
    role: "School transport desk",
    phone: "+2348021230000",
  },
  {
    id: "contact-3",
    name: "Funmi Adeyemi",
    role: "School nurse",
    phone: "+2348049876543",
  },
  {
    id: "contact-4",
    name: "Emergency services",
    role: "Police / ambulance",
    phone: "112",
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers — trivial joins, kept here so screens never hand-roll them
// ---------------------------------------------------------------------------

export function getStop(stopId: string): Stop | undefined {
  return stops.find((s) => s.id === stopId);
}

export function getStopsForRoute(routeId: string): Stop[] {
  return stops
    .filter((s) => s.routeId === routeId)
    .sort((a, b) => a.sequence - b.sequence);
}

export function getBus(busId: string): Bus | undefined {
  return buses.find((b) => b.id === busId);
}

export function getStudentsForBus(busId: string): Student[] {
  return students.filter((s) => s.busId === busId);
}

export function getStudentsForParent(parentId: string): Student[] {
  return students.filter((s) => s.parentId === parentId);
}

export function getStudent(studentId: string): Student | undefined {
  return students.find((s) => s.id === studentId);
}

export function getAttendanceForStudent(
  studentId: string,
  date: string = today,
): AttendanceRecord | undefined {
  return attendanceRecords.find(
    (a) => a.studentId === studentId && a.date === date,
  );
}

export function getTripsForBus(busId: string): Trip[] {
  return trips
    .filter((t) => t.busId === busId)
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
}

export function getMessagesForBus(busId: string): Message[] {
  return messages
    .filter((m) => m.busId === busId)
    .sort((a, b) => (a.sentAt < b.sentAt ? -1 : 1));
}
