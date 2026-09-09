import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen, Card, Field, Row, Avatar, Button, Header } from "@/components";
import { theme, typography, spacing } from "@/theme";
import { useSession } from "@/services/session";
import { getStudentsForParent } from "@/data/mock";

export default function ProfileSetupScreen() {
  const { user, completeProfile, isLoading } = useSession();
  const [phone, setPhone] = useState("");
  const children = getStudentsForParent(user?.id ?? "");

  return (
    <Screen padded>
      <Text style={styles.intro} allowFontScaling>
        Just one more step, {user?.name.split(" ")[0]}. We'll use your
        number to reach you about pickup and drop-off.
      </Text>

      <Header title="Contact number" />
      <Card>
        <Field
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="+234 800 000 0000"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          returnKeyType="done"
          isLast
        />
      </Card>

      {children.length > 0 ? (
        <>
          <Header title="Linked children" />
          <Card dividerInset={68}>
            {children.map((child, index) => (
              <Row
                key={child.id}
                leading={<Avatar initials={child.initials} size={36} />}
                title={child.name}
                subtitle={child.grade}
                accessory="none"
                isLast={index === children.length - 1}
              />
            ))}
          </Card>
        </>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Continue"
          variant="primary"
          disabled={phone.trim().length < 7}
          loading={isLoading}
          onPress={() => completeProfile({ phone: phone.trim() })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: theme.inkSoft,
    marginTop: 12,
    marginBottom: 4,
  },
  actions: {
    marginTop: spacing.xl,
    marginHorizontal: 16,
  },
});
