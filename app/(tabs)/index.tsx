import { useMemo } from "react";
import { Screen, Header, Card, Row, Avatar, EtaHero } from "@/components";
import { useSession } from "@/services/session";
import { useBusPosition } from "@/hooks/useBusPosition";
import {
  getStudentsForParent,
  getBus,
  getStop,
  getStopsForRoute,
  getMessagesForBus,
} from "@/data/mock";
import { projectedEtaSeconds } from "@/services/tracking";
import { formatRelativeTime } from "@/utils/format";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user } = useSession();
  const children = useMemo(
    () => getStudentsForParent(user?.id ?? ""),
    [user?.id],
  );

  const firstChild = children[0];
  const bus = firstChild ? getBus(firstChild.busId) : undefined;
  const position = useBusPosition(bus?.id);
  const stopList = bus ? getStopsForRoute(bus.routeId) : [];
  const stopIndex = firstChild
    ? stopList.findIndex((s) => s.id === firstChild.stopId)
    : -1;
  const etaSeconds =
    position && stopIndex >= 0
      ? projectedEtaSeconds(position, stopIndex)
      : null;
  const stopName = firstChild
    ? (getStop(firstChild.stopId)?.name ?? "your stop")
    : "your stop";

  const latestMessage = bus ? getMessagesForBus(bus.id).at(-1) : undefined;

  return (
    <Screen>
      {bus ? (
        <EtaHero
          stopName={stopName}
          etaSeconds={etaSeconds}
          status={position?.status ?? null}
          onPress={() => router.push(`/bus/${bus.id}`)}
        />
      ) : null}

      <Header title="Children" />
      <Card dividerInset={68}>
        {children.map((child) => (
          <Row
            key={child.id}
            leading={<Avatar initials={child.initials} size={36} />}
            title={child.name}
            subtitle={`${child.grade} · ${getStop(child.stopId)?.name ?? ""}`}
            onPress={() => router.push(`/student/${child.id}`)}
          />
        ))}
      </Card>

      {latestMessage ? (
        <>
          <Header title="Latest message" />
          <Card>
            <Row
              title={latestMessage.senderName}
              subtitle={latestMessage.body}
              value={formatRelativeTime(latestMessage.sentAt)}
              onPress={() => router.push("/(tabs)/chat")}
            />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}
