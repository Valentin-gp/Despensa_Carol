import { useEffect, useState, type CSSProperties } from 'react';

export const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Retraso escalonado para las entradas: style={d(2)} */
export const d = (i: number) => ({ '--i': i }) as CSSProperties;

/** Marca como visibles, una sola vez, los elementos [data-reveal] al entrar en pantalla. */
export function useReveal(dep: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reduced() || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            (en.target as HTMLElement).classList.add('in');
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    );
    els.forEach((e) => {
      e.classList.add('rv');
      io.observe(e);
    });
    return () => io.disconnect();
  }, [dep]);
}

/** Índice que avanza solo cada `holdMs`; se pausa con la pestaña oculta y respeta reduced-motion. */
export function useCycle(length: number, holdMs: number): [number, () => void] {
  const [i, setI] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const f = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', f);
    return () => document.removeEventListener('visibilitychange', f);
  }, []);
  useEffect(() => {
    if (length < 2 || hidden || reduced()) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % length), holdMs);
    return () => window.clearTimeout(t);
  }, [i, length, holdMs, hidden]);
  return [i, () => setI((v) => (v + 1) % length)];
}

/** Hora actual refrescada cada minuto (para el estado abierto/cerrado). */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}
