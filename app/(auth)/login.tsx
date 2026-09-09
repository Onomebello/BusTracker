import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Screen, Card, Field, Button } from "@/components";
import { theme, typography, spacing } from "@/theme";
import { useSession } from "@/services/session";

export default function LoginScreen() {
  const { signIn, isLoading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim().length > 3 && password.length > 0;

  return (
    <Screen padded>
      <View style={styles.hero}>
        <Text style={styles.appName} allowFontScaling>
          BusTracker
        </Text>
        <Text style={styles.tagline} allowFontScaling>
          See your child's bus, in real time.
        </Text>
      </View>

      <Card>
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Required"
          secureTextEntry
          textContentType="password"
          returnKeyType="done"
          isLast
        />
      </Card>

      <View style={styles.actions}>
        <Button
          title="Sign in"
          variant="primary"
          disabled={!canSubmit}
          loading={isLoading}
          onPress={() => signIn(email.trim(), password)}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText} allowFontScaling>
          New here?{" "}
        </Text>
        <Link href="/signup" style={styles.link}>
          Create an account
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: spacing.xxl,
    gap: 6,
  },
  appName: {
    fontSize: typography.largeTitle.fontSize,
    lineHeight: typography.largeTitle.lineHeight,
    fontWeight: typography.largeTitle.fontWeight,
    color: theme.ink,
  },
  tagline: {
    fontSize: typography.body.fontSize,
    color: theme.inkSoft,
    textAlign: "center",
  },
  actions: {
    marginTop: spacing.xl,
    marginHorizontal: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.subhead.fontSize,
    color: theme.inkSoft,
  },
  link: {
    fontSize: typography.subhead.fontSize,
    color: theme.tint,
    fontWeight: "600",
  },
});
