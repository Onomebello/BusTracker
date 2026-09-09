import { useEffect, useState } from "react";
import { subscribeToBus, type BusPosition } from "@/services/tracking";

/** Subscribes to a bus's live position for the lifetime of the component. */
export function useBusPosition(busId: string | undefined): BusPosition | null {
  const [position, setPosition] = useState<BusPosition | null>(null);

  useEffect(() => {
    if (!busId) {
      setPosition(null);
      return;
    }
    setPosition(null);
    const unsubscribe = subscribeToBus(busId, setPosition);
    return unsubscribe;
  }, [busId]);

  return position;
}
