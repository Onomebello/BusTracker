import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen, Header, Card, Row, Avatar, Pill, IconSymbol } from "@/components";
import { theme, typography, spacing } from "@/theme";
import { getStudent, getStop, getBus, getAttendanceForStudent } from "@/data/mock";

const ATTENDANCE_LABEL: Record<string, string> = {
  waiting: "Waiting for pickup",
  boarded: "On the bus",
  absent: "Marked absent",
  dropped_off: "Dropped off",
};

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const student = getStudent(id ?? "");

  if (!student) {
    return (
      <Screen padded>
        <Text style={styles.empty} allowFontScaling>
          Student not found.
        </Text>
      </Screen>
    );
  }

  const stop = getStop(student.stopId);
  const bus = getBus(student.busId);
  const attendance = getAttendanceForStudent(student.id);

  return (
    <Screen>
      <View style={styles.hero}>
        <Avatar initials={student.initials} size={72} />
        <Text style={styles.name} allowFontScaling>
          {student.name}
        </Text>
        <Text style={styles.grade} allowFontScaling>
          {student.grade}
        </Text>
        {attendance ? (
          <Pill
            label={ATTENDANCE_LABEL[attendance.status] ?? attendance.status}
            tone={
              attendance.status === "absent"
                ? "alert"
                : attendance.status === "boarded"
                  ? "live"
                  : "neutral"
            }
          />
        ) : null}
      </View>

      <Header title="Pickup" />
      <Card dividerInset={44}>
        <Row
          leading={<IconSymbol name="pin" size={20} color={theme.tint} />}
          title={stop?.name ?? "No stop assigned"}
          subtitle="Stop"
          accessory="none"
          isLast
        />
      </Card>

      {bus ? (
        <>
          <Header title="Bus" />
          <Card dividerInset={44}>
            <Row
              leading={<IconSymbol name="bus" size={20} color={theme.bus} />}
              title={bus.plateNumber}
              subtitle={bus.driverName}
              onPress={() => router.push(`/bus/${bus.id}`)}
              isLast
            />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  name: {
    fontSize: typography.title2.fontSize,
    fontWeight: "600",
    color: theme.ink,
  },
  grade: {
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
