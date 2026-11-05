import { d, useCycle } from '../lib/motion';
import { ScallopEdge } from './Awning';

const SET = [
  { src: '/fotos/foto-01.webp', alt: 'Heladeras con bebidas frías' },
  { src: '/fotos/foto-04.webp', alt: 'Estantes con aceites, conservas y productos de almacén' },
  { src: '/fotos/foto-09.webp', alt: 'Estantes con panificados y cereales' },
  { src: '/fotos/foto-14.webp', alt: 'Perfumería y artículos de limpieza' },
  { src: '/fotos/foto-19.webp', alt: 'Mercadería apilada en sacos' },
  { src: '/fotos/foto-20.webp', alt: 'Productos cárnicos' },
];

export default function Gallery() {
  const [i, next] = useCycle(SET.length, 3200);
  return (
    <section className="gallery" id="fotos">
      <div className="gallery__text">
        <h2 data-reveal style={d(0)}>
          Así es por dentro
        </h2>
        <p className="lead" data-reveal style={d(1)} aria-live="polite">
          {SET[i].alt}
        </p>
        <p className="small" data-reveal style={d(2)}>
          Tocá la foto para ver la siguiente.
        </p>
      </div>
      <button type="button" className="frame" onClick={next} aria-label="Ver la siguiente foto" data-reveal style={d(1)}>
        {SET.map((s, n) => (
          <img key={s.src} className={`layer ${n === i ? 'on' : ''}`} src={s.src} alt={n === i ? s.alt : ''} width={750} height={1000} loading="lazy" />
        ))}
        <ScallopEdge />
      </button>
    </section>
  );
}
