import type { BusinessProfile } from '../../shared/types';

export default function Header({ profile }: { profile: BusinessProfile }) {
  return (
    <header className="bar">
      <a className="bar__logo" href="#top" aria-label={`${profile.name}, inicio`}>
        <img src="/logo.png" alt={profile.name} width={84} height={64} />
      </a>
      <nav className="bar__nav" aria-label="Secciones">
        <a href="#horarios">Horarios</a>
        <a href="#que-encontras">Qué encontrás</a>
        <a href="#fotos">Fotos</a>
        <a href="#donde">Dónde estamos</a>
      </nav>
      <a className="btn" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
    </header>
  );
}
