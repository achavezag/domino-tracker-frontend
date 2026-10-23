export function formatDate(date?: string) {
  if (!date) return "En curso";

  // Las fechas "solo fecha" (YYYY-MM-DD) no llevan hora/zona, así que
  // `new Date(date)` las interpreta como medianoche UTC y, en zonas con
  // offset negativo, terminan mostrando el día anterior. Se parsean como
  // fecha local en ese caso; las que sí traen hora (ISO datetime) siguen
  // el comportamiento normal.
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);

  const parsed = isDateOnly
    ? (() => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day);
      })()
    : new Date(date);

  return parsed.toLocaleDateString("es-ES", {
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