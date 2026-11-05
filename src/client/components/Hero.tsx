import type { SiteData } from '../../shared/types';
import { d, useCycle } from '../lib/motion';
import { Awning } from './Awning';

const SLIDES = [
  { src: '/fotos/foto-02.webp', alt: 'Estantes turquesa con productos de almacén en Despensa Carol' },
  { src: '/fotos/foto-12.webp', alt: 'Sector de bazar con vasos y jarras' },
  { src: '/fotos/foto-08.webp', alt: 'Estantes de limpieza y bazar bajo el techo de madera' },
];

export default function Hero({ data }: { data: SiteData }) {
  const { profile: p } = data;
  const [i] = useCycle(SLIDES.length, 6500);
  return (
    <section className="hero" id="top">
      <div className="hero__photo">
        <div className="hero__zoom">
          {SLIDES.map((s, n) => (
            <img key={s.src} className={`layer ${n === i ? 'on' : ''}`} src={s.src} alt={n === i ? s.alt : ''} width={750} height={1000} />
          ))}
        </div>
      </div>

      <div className="hero__card">
        <Awning />
        <div className="hero__body">
          <h1 data-reveal style={d(0)}>
            Pagá como quieras
          </h1>
          <p className="lead" data-reveal style={d(1)}>
            Efectivo, tarjeta y QR. {p.tagline} en Luque.
          </p>

          <ul className="pay">
            {data.paymentMethods.map((m, n) => (
              <li key={m.id} data-reveal style={d(2 + n)}>
                <span className="pay__dot" aria-hidden="true" />
                <div>
                  <strong>{m.name}</strong>
                  <small>{m.detail || m.description}</small>
                </div>
              </li>
            ))}
          </ul>

          <div className="hero__actions" data-reveal style={d(5)}>
            <a className="btn" href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noreferrer">
              Escribinos por WhatsApp
            </a>
            <a className="link" href="#horarios">
              Horarios
            </a>
            <a className="link" href="#donde">
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
