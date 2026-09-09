import { StyleSheet, Text } from "react-native";
import { Screen, Header, Card, Row, Avatar, Pill } from "@/components";
import { theme, typography } from "@/theme";
import { useSession } from "@/services/session";
import { getStudentsForParent, getAttendanceForStudent } from "@/data/mock";
import { formatRelativeTime } from "@/utils/format";

const STATUS_LABEL: Record<string, string> = {
  waiting: "Waiting",
  boarded: "Boarded",
  absent: "Absent",
  dropped_off: "Dropped off",
};

const STATUS_TONE: Record<string, "neutral" | "live" | "alert"> = {
  waiting: "neutral",
  boarded: "live",
  absent: "alert",
  dropped_off: "neutral",
};

export default function AttendanceScreen() {
  const { user } = useSession();
  const children = getStudentsForParent(user?.id ?? "");

  return (
    <Screen>
      <Text style={styles.intro} allowFontScaling>
        Today's status for each child, updated automatically as they board
        and leave the bus.
      </Text>

      <Header title="Today" />
      <Card dividerInset={68}>
        {children.map((child) => {
          const record = getAttendanceForStudent(child.id);
          const status = record?.status ?? "waiting";
          return (
            <Row
              key={child.id}
              leading={<Avatar initials={child.initials} size={36} />}
              title={child.name}
              subtitle={
                record?.markedAt
                  ? formatRelativeTime(record.markedAt)
                  : "Not marked yet"
              }
              accessory={<Pill label={STATUS_LABEL[status]} tone={STATUS_TONE[status]} />}
            />
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: theme.inkSoft,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
});
