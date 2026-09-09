import { Platform, PlatformColor, type OpaqueColorValue } from "react-native";

type Color = string | OpaqueColorValue;

/**
 * iOS gets the real system color (tracks Dark Mode automatically).
 * Android gets the matching hex fallback frozen at design time.
 */
function system(iosName: string, androidHex: string): Color {
  return Platform.OS === "ios" ? PlatformColor(iosName) : androidHex;
}

export const colors = {
  // Text
  label: system("label", "#000000"),
  secondaryLabel: system("secondaryLabel", "rgba(60,60,67,0.6)"),
  tertiaryLabel: system("tertiaryLabel", "rgba(60,60,67,0.3)"),

  // Backgrounds
  systemBackground: system("systemBackground", "#FFFFFF"),
  secondarySystemBackground: system("secondarySystemBackground", "#F2F2F7"),
  systemGroupedBackground: system("systemGroupedBackground", "#F2F2F7"),
  secondarySystemGroupedBackground: system(
    "secondarySystemGroupedBackground",
    "#FFFFFF",
  ),

  // Lines
  separator: system("separator", "rgba(60,60,67,0.29)"),
  opaqueSeparator: system("opaqueSeparator", "#C6C6C8"),

  // Tint — the ONLY interactive colour in the app
  systemBlue: system("systemBlue", "#007AFF"),

  // Semantic data colours — never chrome, never decoration
  systemGreen: system("systemGreen", "#34C759"),
  systemRed: system("systemRed", "#FF3B30"),
  systemOrange: system("systemOrange", "#FF9500"),
} as const;

/**
 * Friendly aliases used across the app. Keeping every call site on these
 * names (instead of raw `colors.*`) is what makes the colour discipline
 * enforceable in one place: amber (bus) and green (live) are semantic data
 * colours, not chrome, and nothing else in the app may reach for them.
 */
export const theme = {
  tint: colors.systemBlue,

  ink: colors.label,
  inkSoft: colors.secondaryLabel,
  inkFaint: colors.tertiaryLabel,

  paper: colors.systemGroupedBackground,
  surface: colors.systemBackground,
  surfaceElevated: colors.secondarySystemGroupedBackground,

  hairline: colors.separator,
  hairlineOpaque: colors.opaqueSeparator,

  // Data colour: the bus marker and its route line, nothing decorative
  bus: colors.systemOrange,
  busDeep: "#C97E05",

  // Data colour: "live right now", nothing else
  live: colors.systemGreen,
  liveSoft: "rgba(52,199,89,0.12)",

  alert: colors.systemRed,
  alertSoft: "rgba(255,59,48,0.12)",

  idle: colors.tertiaryLabel,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  full: 999,
} as const;

export const layout = {
  screenPadding: 16,
  rowMinHeight: 44,
} as const;

/** Apple's iOS text styles (size / line-height / weight). Dynamic Type ready. */
export const typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: "700" as const },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: "400" as const },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "400" as const },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: "400" as const },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600" as const },
  body: { fontSize: 17, lineHeight: 22, fontWeight: "400" as const },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: "400" as const },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: "400" as const },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: "400" as const },
} as const;

export type TextStyleName = keyof typeof typography;
