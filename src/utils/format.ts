/** Formats a seconds count as a compact "N min" / "Less than a minute" string. */
export function formatEtaMinutes(seconds: number): string {
  if (seconds <= 0) return "Arriving now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return "Less than a minute";
  if (minutes === 1) return "1 minute";
  return `${minutes} minutes`;
}

/** Formats a seconds count as a big standalone number of minutes for a hero display. */
export function formatEtaMinutesValue(seconds: number): string {
  if (seconds <= 0) return "0";
  return String(Math.max(1, Math.round(seconds / 60)));
}

export function formatSpeed(kph: number): string {
  return `${Math.round(kph)} km/h`;
}

export function formatClockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.toDateString() === b.toDateString();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function formatDuration(startIso: string, endIso: string | null): string {
  if (!endIso) return "In progress";
  const minutes = Math.round(
    (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000,
  );
  return `${minutes} min`;
}
