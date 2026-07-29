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