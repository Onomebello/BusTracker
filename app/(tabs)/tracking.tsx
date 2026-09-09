import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Screen, Header, Card, Row, Pill, IconSymbol } from "@/components";
import { theme, typography, spacing } from "@/theme";
import { useSession } from "@/services/session";
import { useBusPosition } from "@/hooks/useBusPosition";
import { getStudentsForParent, getBus, getStopsForRoute } from "@/data/mock";
import { projectedEtaSeconds, type BusStatus } from "@/services/tracking";
import { formatEtaMinutes, formatSpeed } from "@/utils/format";

const STATUS_LABEL: Record<BusStatus, string> = {
  not_started: "Not started",
  en_route: "En route",
  at_stop: "At stop",
  finished: "Finished",
};

export default function TrackingScreen() {
  const { user } = useSession();
  const busId = useMemo(
    () => getStudentsForParent(user?.id ?? "")[0]?.busId,
    [user?.id],
  );
  const bus = busId ? getBus(busId) : undefined;
  const stopList = bus ? getStopsForRoute(bus.routeId) : [];
  const position = useBusPosition(bus?.id);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!position) return;
    mapRef.current?.animateToRegion(
      {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      400,
    );
  }, [position?.latitude, position?.longitude]);

  if (!bus || stopList.length === 0) {
    return (
      <Screen padded>
        <Text style={styles.empty} allowFontScaling>
          No route assigned yet.
        </Text>
      </Screen>
    );
  }

  const isLive = position?.status === "en_route" || position?.status === "at_stop";

  return (
    <Screen>
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: stopList[0].latitude,
            longitude: stopList[0].longitude,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
        >
          <Polyline
            coordinates={stopList.map((s) => ({
              latitude: s.latitude,
              longitude: s.longitude,
            }))}
            strokeColor={theme.hairlineOpaque as string}
            strokeWidth={3}
          />
          {stopList.map((stop, index) => (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.name}
              pinColor={
                position && index < position.nextStopIndex
                  ? (theme.inkFaint as string)
                  : (theme.tint as string)
              }
            />
          ))}
          {position ? (
            <Marker
              coordinate={{ latitude: position.latitude, longitude: position.longitude }}
              title={bus.plateNumber}
              rotation={position.headingDeg}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
            >
              <View style={styles.busMarker}>
                <IconSymbol name="bus" size={16} color="#FFFFFF" />
              </View>
            </Marker>
          ) : null}
        </MapView>
      </View>

      <View style={styles.statusRow}>
        <Pill
          label={position ? STATUS_LABEL[position.status] : "Loading"}
          tone={isLive ? "live" : "neutral"}
        />
        {position?.status === "en_route" ? (
          <Text style={styles.speed} allowFontScaling>
            {formatSpeed(position.speedKph)}
          </Text>
        ) : null}
      </View>

      <Header title="Route" />
      <Card dividerInset={44}>
        {stopList.map((stop, index) => {
          const passed =
            position && (position.status === "finished" || index < position.nextStopIndex);
          return (
            <Row
              key={stop.id}
              leading={
                <IconSymbol
                  name={passed ? "checkCircle" : "pin"}
                  size={20}
                  color={passed ? theme.inkFaint : theme.bus}
                />
              }
              title={stop.name}
              value={
                !position
                  ? undefined
                  : passed
                    ? "Passed"
                    : formatEtaMinutes(projectedEtaSeconds(position, index))
              }
              accessory="none"
              isLast={index === stopList.length - 1}
            />
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    height: 260,
    marginBottom: spacing.sm,
  },
  busMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.bus,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: spacing.sm,
  },
  speed: {
    fontSize: typography.subhead.fontSize,
    color: theme.inkSoft,
  },
  empty: {
    fontSize: typography.body.fontSize,
    color: theme.inkSoft,
    textAlign: "center",
    marginTop: 40,
  },
});
