export function formatDate(date?: string) {
  if (!date) return "En curso";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatAverage(winRate?: number) {
  if (winRate === undefined || winRate === 0) return ".000";
  if (winRate === 1) return "1.000";

  return winRate.toFixed(3).substring(1);
}

export function getPlayerAvatar(nickname: string) {
  return `/players/${nickname.toLowerCase()}.png`;
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toDateOnly(date: string) {
  return toDateInputValue(new Date(date));
}

export function addDaysToDate(date: string, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);

  return toDateInputValue(d);
}