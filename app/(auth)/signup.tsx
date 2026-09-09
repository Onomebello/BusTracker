import { useState } from "react";
import { View } from "react-native";
import { Screen, Card, Field, Button } from "@/components";
import { spacing } from "@/theme";
import { useSession } from "@/services/session";

export default function SignupScreen() {
  const { signUp, isLoading } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    name.trim().length > 1 && email.trim().length > 3 && password.length > 0;

  return (
    <Screen padded>
      <Card>
        <Field
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          textContentType="name"
          returnKeyType="next"
        />
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
          placeholder="At least 8 characters"
          secureTextEntry
          textContentType="newPassword"
          returnKeyType="done"
          isLast
        />
      </Card>

      <View style={{ marginTop: spacing.xl, marginHorizontal: 16 }}>
        <Button
          title="Create account"
          variant="primary"
          disabled={!canSubmit}
          loading={isLoading}
          onPress={() => signUp(name.trim(), email.trim(), password)}
        />
      </View>
    </Screen>
  );
}
