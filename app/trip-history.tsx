import { StyleSheet, Text, View } from "react-native";
import { Screen, Header, Card, Row, IconSymbol } from "@/components";
import { theme, typography } from "@/theme";
import { useSession } from "@/services/session";
import { getStudentsForParent, getTripsForBus, type Trip } from "@/data/mock";
import { formatDayLabel, formatClockTime, formatDuration } from "@/utils/format";

export default function TripHistoryScreen() {
  const { user } = useSession();
  const busId = getStudentsForParent(user?.id ?? "")[0]?.busId;
  const trips = busId ? getTripsForBus(busId) : [];

  if (trips.length === 0) {
    return (
      <Screen padded>
        <Text style={styles.empty} allowFontScaling>
          No trips recorded yet.
        </Text>
      </Screen>
    );
  }

  const byDate = new Map<string, Trip[]>();
  for (const trip of trips) {
    const list = byDate.get(trip.date) ?? [];
    list.push(trip);
    byDate.set(trip.date, list);
  }

  return (
    <Screen>
      {[...byDate.entries()].map(([date, dayTrips]) => (
        <View key={date}>
          <Header title={formatDayLabel(date)} />
          <Card dividerInset={44}>
            {dayTrips.map((trip) => (
              <Row
                key={trip.id}
                leading={
                  <IconSymbol
                    name={trip.direction === "pickup" ? "navigation" : "location"}
                    size={20}
                    color={theme.tint}
                  />
                }
                title={trip.direction === "pickup" ? "Pickup" : "Drop-off"}
                subtitle={`${formatClockTime(trip.startedAt)} · ${formatDuration(
                  trip.startedAt,
                  trip.endedAt,
                )}`}
                accessory="none"
              />
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: typography.body.fontSize,
    color: theme.inkSoft,
    textAlign: "center",
    marginTop: 40,
  },
});
