import { useEffect, useState } from 'react';
import type { SiteData } from '../../shared/types';
import ChatWidget from '../components/ChatWidget';
import Gallery from '../components/Gallery';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { Contact, Footer, Hours, Promotions, Rubros, Topup } from '../components/Sections';
import { getSite } from '../lib/api';
import { useReveal } from '../lib/motion';

export default function Site() {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSite().then(setData).catch(() => setError(true));
  }, []);
  useReveal(data);

  if (error || !data) {
    return (
      <main className="splash">
        <img src="/logo.png" alt="Despensa Carol" width={158} height={120} />
        {error && <p className="lead">No pudimos cargar la información. Probá recargar la página.</p>}
      </main>
    );
  }

  return (
    <>
      <Header profile={data.profile} />
      <main>
        <Hero data={data} />
        <Promotions data={data} />
        <Hours data={data} />
        <Rubros data={data} />
        <Topup data={data} />
        <Gallery />
        <Contact data={data} />
      </main>
      <Footer data={data} />
      <ChatWidget profile={data.profile} />
    </>
  );
}
