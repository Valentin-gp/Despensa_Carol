import { MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { BusinessProfile, ChatTopic } from '../../shared/types';
import { ApiError, sendChat } from '../lib/api';

interface Msg {
  from: 'bot' | 'user';
  text: string;
  whatsapp?: boolean;
}

const CHIPS: { topic: ChatTopic; label: string }[] = [
  { topic: 'horario', label: 'Horario' },
  { topic: 'ubicacion', label: 'Ubicación' },
  { topic: 'pagos', label: 'Medios de pago' },
  { topic: 'servicios', label: 'Servicios' },
  { topic: 'promociones', label: 'Promociones' },
  { topic: 'contacto', label: 'Contacto' },
];

export default function ChatWidget({ profile }: { profile: BusinessProfile }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'bot',
      text: `Hola, soy el asistente virtual de ${profile.name} (un asistente automático). Elegí una opción o escribime tu consulta.`,
    },
  ]);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [msgs, open]);

  async function ask(body: { message?: string; topic?: ChatTopic }, shown: string) {
    if (busy) return;
    setMsgs((m) => [...m, { from: 'user', text: shown }]);
    setBusy(true);
    try {
      const res = await sendChat(body);
      setMsgs((m) => [...m, { from: 'bot', text: res.reply }]);
    } catch (e) {
      const err = e instanceof ApiError ? e : null;
      const wa = err?.code === 'AI_DAILY_QUOTA_EXHAUSTED' || err?.code === 'AI_UNAVAILABLE';
      setMsgs((m) => [...m, { from: 'bot', text: err?.message ?? 'No pude responder ahora. Probá de nuevo.', whatsapp: wa }]);
    } finally {
      setBusy(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;
    setText('');
    void ask({ message }, message);
  }

  return (
    <>
      {!open && (
        <button className="chat__fab" onClick={() => setOpen(true)} aria-label="Abrir asistente virtual">
          <MessageCircle size={26} aria-hidden /> <span>Consultanos</span>
        </button>
      )}
      {open && (
        <section className="chat" aria-label="Asistente virtual">
          <header className="chat__head">
            <strong>Asistente de {profile.name}</strong>
            <button onClick={() => setOpen(false)} aria-label="Cerrar asistente">
              <X size={20} aria-hidden />
            </button>
          </header>
          <div className="chat__body" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`bubble bubble--${m.from}`}>
                {m.text.split('\n').map((l, j) => (
                  <p key={j}>{l}</p>
                ))}
                {m.whatsapp && (
                  <a className="btn btn--gold" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer">
                    Escribir por WhatsApp
                  </a>
                )}
              </div>
            ))}
            {busy && <div className="bubble bubble--bot">Escribiendo…</div>}
            <div ref={end} />
          </div>
          <div className="chat__chips">
            {CHIPS.map((c) => (
              <button key={c.topic} onClick={() => void ask({ topic: c.topic }, c.label)} disabled={busy}>
                {c.label}
              </button>
            ))}
          </div>
          <form className="chat__form" onSubmit={submit}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={300}
              placeholder="Escribí tu consulta…"
              aria-label="Tu consulta"
            />
            <button type="submit" disabled={busy || !text.trim()} aria-label="Enviar">
              <Send size={18} aria-hidden />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
