import { formatGs } from '../../shared/format';
import type { ChatTopic, SiteData } from '../../shared/types';
import { hoursLines } from './chatContext';

/** Respuestas directas desde los datos: no consumen IA. */
export function answerTopic(topic: ChatTopic, data: SiteData): string {
  const { profile: p } = data;
  switch (topic) {
    case 'horario':
      return `Nuestro horario de atención:\n${hoursLines(data)}`;
    case 'ubicacion':
      return `Estamos en ${p.address}, ${p.addressReference.toLowerCase()}, ${p.city}.`;
    case 'pagos': {
      const lista = data.paymentMethods.map((m) => m.name.toLowerCase()).join(', ');
      return lista ? `Aceptamos: ${lista}.` : 'Consultanos por WhatsApp los medios de pago disponibles.';
    }
    case 'servicios': {
      const s = data.services.filter((x) => x.kind === 'servicio').map((x) => `${x.name}${x.description ? ` (${x.description})` : ''}`);
      const r = data.services.filter((x) => x.kind === 'rubro').map((x) => x.name.toLowerCase());
      const partes: string[] = [];
      if (s.length) partes.push(`Servicios: ${s.join(', ')}.`);
      if (r.length) partes.push(`Encontrás: ${r.join(', ')}.`);
      return partes.join(' ') || 'Consultanos por WhatsApp.';
    }
    case 'promociones': {
      if (!data.promotions.length) return 'Por ahora no tenemos promociones publicadas. Seguinos en Facebook o escribinos por WhatsApp.';
      return (
        'Promociones vigentes:\n' +
        data.promotions
          .map((x) => `• ${x.product}${x.promoPrice != null ? ` a ${formatGs(x.promoPrice)}` : ''}${x.endsOn ? ` (hasta ${x.endsOn})` : ''}`)
          .join('\n')
      );
    }
    case 'contacto':
      return `Escribinos o llamanos al ${p.phone} (WhatsApp disponible). También estamos en Facebook.`;
  }
}
