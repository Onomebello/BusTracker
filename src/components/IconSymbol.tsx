import {
  Platform,
  type ColorValue,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/**
 * SF Symbols on iOS, Ionicons everywhere else. Screens ask for one of these
 * semantic names — new icons get added to the registry, never sprinkled as
 * raw symbol strings through the app.
 */
const REGISTRY = {
  home: { ios: "house.fill", ionicon: "home" },
  tracking: { ios: "map.fill", ionicon: "map" },
  chat: { ios: "bubble.left.and.bubble.right.fill", ionicon: "chatbubbles" },
  more: { ios: "ellipsis.circle.fill", ionicon: "ellipsis-horizontal-circle" },
  chevronRight: { ios: "chevron.right", ionicon: "chevron-forward" },
  chevronLeft: { ios: "chevron.left", ionicon: "chevron-back" },
  phone: { ios: "phone.fill", ionicon: "call" },
  phoneCircle: { ios: "phone.circle.fill", ionicon: "call" },
  bell: { ios: "bell.fill", ionicon: "notifications" },
  gear: { ios: "gearshape.fill", ionicon: "settings" },
  history: { ios: "clock.arrow.circlepath", ionicon: "time" },
  warningTriangle: {
    ios: "exclamationmark.triangle.fill",
    ionicon: "warning",
  },
  person: { ios: "person.crop.circle.fill", ionicon: "person-circle" },
  calendar: { ios: "calendar", ionicon: "calendar" },
  checkCircle: { ios: "checkmark.circle.fill", ionicon: "checkmark-circle" },
  xCircle: { ios: "xmark.circle.fill", ionicon: "close-circle" },
  location: { ios: "location.fill", ionicon: "locate" },
  navigation: { ios: "location.north.fill", ionicon: "navigate" },
  speed: { ios: "speedometer", ionicon: "speedometer" },
  message: { ios: "message.fill", ionicon: "chatbox" },
  people: { ios: "person.2.fill", ionicon: "people" },
  hand: { ios: "hand.raised.fill", ionicon: "hand-left" },
  list: { ios: "list.bullet", ionicon: "list" },
  check: { ios: "checkmark", ionicon: "checkmark" },
  close: { ios: "xmark", ionicon: "close" },
  pin: { ios: "mappin.and.ellipse", ionicon: "location" },
  bus: { ios: "bus.fill", ionicon: "bus" },
  star: { ios: "star.fill", ionicon: "star" },
  send: { ios: "paperplane.fill", ionicon: "send" },
} as const satisfies Record<string, { ios: SFSymbol; ionicon: IoniconName }>;

export type IconName = keyof typeof REGISTRY;

type IconSymbolProps = {
  name: IconName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<ViewStyle>;
};

export function IconSymbol({ name, size = 20, color, style }: IconSymbolProps) {
  const entry = REGISTRY[name];

  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name={entry.ios}
        size={size}
        tintColor={color}
        resizeMode="scaleAspectFit"
        style={[{ width: size, height: size }, style]}
      />
    );
  }

  return (
    <Ionicons
      name={entry.ionicon}
      size={size}
      color={color}
      style={style as StyleProp<TextStyle>}
    />
  );
}
