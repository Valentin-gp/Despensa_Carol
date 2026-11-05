import type { BusinessHour } from './types';

export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

function hourText(h: BusinessHour): string {
  return h.closed ? 'Cerrado' : `${h.opens} a ${h.closes} hs`;
}

export function groupHours(hours: BusinessHour[]): { label: string; text: string }[] {
  const byDay = new Map(hours.map((h) => [h.dayOfWeek, h]));
  const groups: { days: number[]; text: string }[] = [];
  for (const d of WEEK_ORDER) {
    const h = byDay.get(d);
    if (!h) continue;
    const text = hourText(h) + (h.note ? ` (${h.note})` : '');
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.days.push(d);
    else groups.push({ days: [d], text });
  }
  return groups.map((g) => ({
    label:
      g.days.length === 1
        ? DAY_NAMES[g.days[0]]
        : `${DAY_NAMES[g.days[0]]} a ${DAY_NAMES[g.days[g.days.length - 1]]}`,
    text: g.text,
  }));
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Paraguay usa UTC-3 todo el año.
function paraguayNow(now: Date): { dow: number; mins: number } {
  const py = new Date(now.getTime() - 3 * 3600 * 1000);
  return { dow: py.getUTCDay(), mins: py.getUTCHours() * 60 + py.getUTCMinutes() };
}

export function getOpenStatus(
  hours: BusinessHour[],
  now: Date = new Date(),
): { open: boolean; title: string; detail: string } {
  const { dow, mins } = paraguayNow(now);
  const byDay = new Map(hours.map((h) => [h.dayOfWeek, h]));
  const today = byDay.get(dow);
  if (today && !today.closed && mins >= toMinutes(today.opens) && mins < toMinutes(today.closes)) {
    return { open: true, title: 'Abierto ahora', detail: `Hasta las ${today.closes} hs` };
  }
  for (let i = 0; i < 8; i++) {
    const day = (dow + i) % 7;
    const h = byDay.get(day);
    if (!h || h.closed) continue;
    if (i === 0 && mins >= toMinutes(h.opens)) continue;
    const when = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DAY_NAMES[day].toLowerCase()}`;
    return { open: false, title: 'Cerrado ahora', detail: `Abrimos ${when} a las ${h.opens} hs` };
  }
  return { open: false, title: 'Cerrado ahora', detail: 'Consultanos por WhatsApp' };
}

export function formatGs(n: number): string {
  return new Intl.NumberFormat('es-PY').format(n) + ' Gs.';
}
