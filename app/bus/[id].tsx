import { useLocalSearchParams } from "expo-router";
import { Linking, StyleSheet, Text } from "react-native";
import { Screen, Header, Card, Row, Avatar, EtaHero, IconSymbol } from "@/components";
import { theme, typography } from "@/theme";
import { useBusPosition } from "@/hooks/useBusPosition";
import { getBus, getStudentsForBus, getStop } from "@/data/mock";
import { formatSpeed } from "@/utils/format";

export default function BusDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bus = getBus(id ?? "");
  const position = useBusPosition(bus?.id);
  const students = bus ? getStudentsForBus(bus.id) : [];

  if (!bus) {
    return (
      <Screen padded>
        <Text style={styles.empty} allowFontScaling>
          Bus not found.
        </Text>
      </Screen>
    );
  }

  const firstStudent = students[0];
  const stopName = firstStudent
    ? (getStop(firstStudent.stopId)?.name ?? "the stop")
    : "the stop";

  return (
    <Screen>
      <EtaHero
        stopName={stopName}
        etaSeconds={position?.etaSeconds ?? null}
        status={position?.status ?? null}
      />

      <Header title="Bus" />
      <Card dividerInset={44}>
        <Row
          leading={<IconSymbol name="bus" size={20} color={theme.bus} />}
          title={bus.plateNumber}
          subtitle={`${bus.capacity} seats`}
          accessory="none"
        />
        <Row
          leading={<IconSymbol name="person" size={20} color={theme.tint} />}
          title={bus.driverName}
          subtitle="Driver"
          accessory={<IconSymbol name="phoneCircle" size={22} color={theme.tint} />}
          onPress={() => Linking.openURL(`tel:${bus.driverPhone}`)}
          isLast
        />
      </Card>

      {position?.status === "en_route" ? (
        <>
          <Header title="Speed" />
          <Card>
            <Row
              title="Current speed"
              value={formatSpeed(position.speedKph)}
              accessory="none"
              isLast
            />
          </Card>
        </>
      ) : null}

      <Header title="Students on this bus" />
      <Card dividerInset={68}>
        {students.map((student) => (
          <Row
            key={student.id}
            leading={<Avatar initials={student.initials} size={36} />}
            title={student.name}
            subtitle={getStop(student.stopId)?.name}
            accessory="none"
          />
        ))}
      </Card>
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
