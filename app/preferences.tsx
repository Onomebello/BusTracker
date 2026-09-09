import { useState } from "react";
import { Switch } from "react-native";
import { Screen, Header, Card, Row } from "@/components";
import { theme } from "@/theme";

export default function PreferencesScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [etaAlerts, setEtaAlerts] = useState(true);
  const [delayAlerts, setDelayAlerts] = useState(true);
  const [driverMessages, setDriverMessages] = useState(true);

  return (
    <Screen>
      <Header title="Notifications" />
      <Card>
        <Row
          title="Push notifications"
          accessory={
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ true: theme.tint as string }}
            />
          }
        />
        <Row
          title="Bus is close to your stop"
          accessory={
            <Switch
              value={etaAlerts}
              onValueChange={setEtaAlerts}
              trackColor={{ true: theme.tint as string }}
              disabled={!pushEnabled}
            />
          }
        />
        <Row
          title="Delays"
          accessory={
            <Switch
              value={delayAlerts}
              onValueChange={setDelayAlerts}
              trackColor={{ true: theme.tint as string }}
              disabled={!pushEnabled}
            />
          }
        />
        <Row
          title="Driver messages"
          accessory={
            <Switch
              value={driverMessages}
              onValueChange={setDriverMessages}
              trackColor={{ true: theme.tint as string }}
              disabled={!pushEnabled}
            />
          }
        />
      </Card>
    </Screen>
  );
}
