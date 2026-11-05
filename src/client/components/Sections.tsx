import { formatGs, getOpenStatus, groupHours } from '../../shared/format';
import type { SiteData } from '../../shared/types';
import { FACHADA } from '../lib/photos';
import { d, useNow } from '../lib/motion';
import { Awning, ScallopEdge } from './Awning';

function shortDate(iso: string | null): string {
  if (!iso) return '';
  const [, m, day] = iso.split('-');
  return `${day}/${m}`;
}

export function Promotions({ data }: { data: SiteData }) {
  if (!data.promotions.length) return null;
  return (
    <section className="promos" id="promociones">
      <h2 data-reveal style={d(0)}>
        Promociones vigentes
      </h2>
      <ul className="promos__list">
        {data.promotions.map((p, n) => (
          <li key={p.id} data-reveal style={d(n + 1)}>
            <div>
              <h3>{p.title || p.product}</h3>
              {p.body && <p>{p.body}</p>}
              <p className="small">
                {p.endsOn ? `Hasta el ${shortDate(p.endsOn)}. ` : ''}
                {p.conditions}
              </p>
            </div>
            {p.promoPrice != null && (
              <p className="promos__price">
                {p.regularPrice != null && <s>{formatGs(p.regularPrice)}</s>}
                <strong>{formatGs(p.promoPrice)}</strong>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Hours({ data }: { data: SiteData }) {
  const now = useNow();
  const status = getOpenStatus(data.hours, now);
  const rows = groupHours(data.hours);
  return (
    <section className="hours" id="horarios">
      <div className="hours__lead">
        <h2 className={status.open ? 'is-open' : ''} data-reveal style={d(0)}>
          {status.title}
        </h2>
        <p className="lead" data-reveal style={d(1)}>
          {status.detail}
        </p>
      </div>
      <ul className="hours__rows">
        {rows.map((r, n) => (
          <li key={r.label} data-reveal style={d(n + 2)}>
            <strong>{r.label}:</strong> {r.text}
          </li>
        ))}
        <li className="small" data-reveal style={d(rows.length + 2)}>
          Los horarios pueden variar un poco. Ante la duda, escribinos por WhatsApp.
        </li>
      </ul>
    </section>
  );
}

const RUBRO_PHOTO: Record<string, string> = {
  Lácteos: '/fotos/foto-02.webp',
  'Bebidas heladas': '/fotos/foto-03.webp',
  'Productos cárnicos': '/fotos/foto-20.webp',
  Panificados: '/fotos/foto-09.webp',
  Bazar: '/fotos/foto-12.webp',
};

export function Rubros({ data }: { data: SiteData }) {
  const rubros = data.services.filter((s) => s.kind === 'rubro');
  return (
    <section className="rubros" id="que-encontras">
      <h2 data-reveal style={d(0)}>
        Qué encontrás en Despensa Carol
      </h2>
      <ul className="rubros__list">
        {rubros.map((r, n) => (
          <li key={r.id} data-reveal style={d(n + 1)}>
            {RUBRO_PHOTO[r.name] ? (
              <img className="bullet" src={RUBRO_PHOTO[r.name]} alt="" width={96} height={96} loading="lazy" />
            ) : (
              <span className="bullet bullet--dot" aria-hidden="true" />
            )}
            <div>
              <strong>{r.name}</strong>
              {r.description && <small>{r.description}</small>}
            </div>
          </li>
        ))}
      </ul>
      <p className="note" data-reveal style={d(rubros.length + 1)}>
        No manejamos inventario en línea. Para saber si tenemos un producto, escribinos por WhatsApp.
      </p>
    </section>
  );
}

function Disc({ names }: { names: string[] }) {
  const N = 22;
  return (
    <div className="disc" data-reveal style={d(1)}>
      <svg viewBox="-122 -122 244 244" aria-hidden="true" focusable="false">
        <circle className="disc__fill" r="98" />
        {Array.from({ length: N }, (_, k) => {
          const a = (2 * Math.PI * k) / N;
          return <circle key={k} className="disc__fill" cx={98 * Math.cos(a)} cy={98 * Math.sin(a)} r="13" />;
        })}
      </svg>
      <ul>
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

export function Topup({ data }: { data: SiteData }) {
  const servicios = data.services.filter((s) => s.kind === 'servicio');
  if (!servicios.length) return null;
  return (
    <section className="topup">
      {servicios.map((s, n) => {
        const names = s.description
          .replace(/\.$/, '')
          .split(/,\s*|\s+y\s+/)
          .map((x) => x.trim())
          .filter(Boolean);
        return (
          <div className="topup__item" key={s.id}>
            <div className="topup__text">
              <h2 data-reveal style={d(n * 2)}>
                Recarga de saldo
              </h2>
              <p className="lead" data-reveal style={d(n * 2 + 1)}>
                Pasá por la despensa y recargá tu celular.
              </p>
            </div>
            {names.length > 0 && <Disc names={names} />}
          </div>
        );
      })}
    </section>
  );
}

export function Contact({ data }: { data: SiteData }) {
  const { profile: p } = data;
  const lat = p.latitude;
  const lng = p.longitude;
  const map =
    lat != null && lng != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.004},${lat - 0.002},${lng + 0.004},${lat + 0.002}&layer=mapnik&marker=${lat},${lng}`
      : null;
  return (
    <section className="contact" id="donde">
      <h2 className="sr-only">Dónde estamos y cómo contactarnos</h2>
      <ul className="contact__rows">
        <li data-reveal style={d(0)}>
          <span>{p.name}</span>
        </li>
        <li data-reveal style={d(1)}>
          <a href={p.mapsUrl} target="_blank" rel="noreferrer">
            {p.address}
          </a>
        </li>
        <li data-reveal style={d(2)}>
          <span>{p.city}</span>
        </li>
        <li data-reveal style={d(3)}>
          <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noreferrer">
            {p.phone}
          </a>
        </li>
      </ul>
      <div className="contact__where">
        <p className="lead" data-reveal style={d(0)}>
          La despensa está sobre la avenida Las Residentas. La calle del barrio es La Milagrosa y 1 de Mayo. El pin de Google Maps puede caer un poco
          hacia la esquina: seguí hasta el número.
        </p>
        {map && <iframe className="map" title="Mapa de Despensa Carol" src={map} loading="lazy" data-reveal style={d(1)} />}
        <div className="fachada" data-reveal style={d(2)}>
          <img src={FACHADA.src} alt={FACHADA.alt} width={FACHADA.w} height={FACHADA.h} loading="lazy" />
          <ScallopEdge />
        </div>
      </div>
    </section>
  );
}

export function Footer({ data }: { data: SiteData }) {
  const { profile: p } = data;
  return (
    <footer className="footer">
      <Awning flat tone="gold" />
      <p className="footer__name" aria-hidden="true">
        {p.name}
      </p>
      <div className="footer__row">
        <a className="btn btn--gold" href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noreferrer">
          WhatsApp {p.phone}
        </a>
        <a className="link" href={`tel:+${p.whatsapp}`}>
          Llamar
        </a>
        {p.facebookUrl && (
          <a className="link" href={p.facebookUrl} target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}
      </div>
    </footer>
  );
}
