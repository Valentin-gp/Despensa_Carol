import { useId } from 'react';

/** El toldo del local: franjas con borde festoneado, igual que el óvalo del logo. */
export function Awning({ flat = false, tone = 'forest' }: { flat?: boolean; tone?: 'forest' | 'gold' }) {
  const id = useId().replace(/:/g, '');
  const h = flat ? 10 : 42;
  return (
    <svg className={`awning awning--${tone}`} width="100%" height={h} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="48" height={h} patternUnits="userSpaceOnUse">
          {flat ? (
            <rect className="awning__fill" width="24" height={h} />
          ) : (
            <>
              <rect className="awning__fill" width="24" height="30" />
              <circle className="awning__fill" cx="12" cy="30" r="12" />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height={h} fill={`url(#${id})`} />
    </svg>
  );
}

/** Borde inferior de una foto con el mismo festón: dibuja el color del fondo entre las ondas. */
export function ScallopEdge({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`scallop ${className}`} width="100%" height="14" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="28" height="14" patternUnits="userSpaceOnUse">
          <path className="scallop__fill" d="M0 0 A14 14 0 0 0 28 0 L28 14 L0 14 Z" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#${id})`} />
    </svg>
  );
}
