import { StyleSheet, Text, View, type ColorValue } from "react-native";
import { theme, typography, radius } from "@/theme";

export type PillTone = "neutral" | "live" | "alert";

type PillProps = {
  label: string;
  tone?: PillTone;
};

/**
 * A small status chip. Tone discipline matters: "live" is reserved for a
 * currently-active tracking state, "alert" for something that needs
 * attention — everything else is neutral slate.
 */
export function Pill({ label, tone = "neutral" }: PillProps) {
  const palette = TONES[tone];
  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.fg }]} allowFontScaling>
        {label}
      </Text>
    </View>
  );
}

const TONES: Record<PillTone, { bg: ColorValue; fg: ColorValue }> = {
  neutral: { bg: theme.paper, fg: theme.inkSoft },
  live: { bg: theme.liveSoft, fg: theme.live },
  alert: { bg: theme.alertSoft, fg: theme.alert },
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  label: {
    fontSize: typography.caption1.fontSize,
    lineHeight: typography.caption1.lineHeight,
    fontWeight: "600",
  },
});
