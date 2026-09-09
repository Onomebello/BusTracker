import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { IconSymbol } from "./IconSymbol";
import { theme } from "@/theme";
import type { BusPosition } from "@/services/tracking";
import type { Stop } from "@/data/mock";

type RouteMapProps = {
  stopList: Stop[];
  position: BusPosition | null;
  busPlate: string;
};

/** The live interactive map — native only, see RouteMap.web.tsx for the web fallback. */
export function RouteMap({ stopList, position, busPlate }: RouteMapProps) {
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

  return (
    <View style={styles.wrap}>
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
            title={busPlate}
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
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 260,
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
});
