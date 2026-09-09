import { Linking, StyleSheet, Text } from "react-native";
import { Screen, Header, Card, Row, IconSymbol } from "@/components";
import { theme, typography, spacing } from "@/theme";
import { emergencyContacts } from "@/data/mock";

export default function EmergencyScreen() {
  return (
    <Screen>
      <Text style={styles.intro} allowFontScaling>
        Call any of these numbers directly if you need help right now.
      </Text>

      <Header title="Contacts" />
      <Card dividerInset={44}>
        {emergencyContacts.map((contact) => (
          <Row
            key={contact.id}
            leading={<IconSymbol name="phoneCircle" size={22} color={theme.alert} />}
            title={contact.name}
            subtitle={contact.role}
            value={contact.phone}
            accessory="none"
            onPress={() => Linking.openURL(`tel:${contact.phone}`)}
          />
        ))}
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
    marginBottom: spacing.xs,
  },
});
