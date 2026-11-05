import { DAY_NAMES, formatGs, groupHours } from '../../shared/format';
import type { SiteData } from '../../shared/types';

function money(n: number | null): string {
  return n == null ? '' : formatGs(n);
}

export function hoursLines(data: SiteData): string {
  return groupHours(data.hours)
    .map((g) => `${g.label}: ${g.text}`)
    .join('\n');
}

export function buildContext(data: SiteData): string {
  const { profile: p } = data;
  const parts: string[] = [];
  parts.push(`NEGOCIO: ${p.name}. ${p.description}`);
  parts.push(`DIRECCIÓN: ${p.address}, ${p.addressReference}, ${p.city}.`);
  parts.push(`TELÉFONO Y WHATSAPP: ${p.phone}. Facebook: ${p.facebookUrl}`);
  parts.push(`HORARIOS:\n${hoursLines(data)}`);
  if (data.paymentMethods.length) {
    parts.push(
      'MEDIOS DE PAGO:\n' +
        data.paymentMethods.map((m) => `- ${m.name}: ${m.description}${m.detail ? ` (${m.detail})` : ''}`).join('\n'),
    );
  }
  const servicios = data.services.filter((s) => s.kind === 'servicio');
  const rubros = data.services.filter((s) => s.kind === 'rubro');
  if (servicios.length) {
    parts.push('SERVICIOS:\n' + servicios.map((s) => `- ${s.name}${s.description ? `: ${s.description}` : ''}`).join('\n'));
  }
  if (rubros.length) parts.push('QUÉ SE VENDE (rubros generales, sin stock): ' + rubros.map((s) => s.name).join(', '));
  if (data.promotions.length) {
    parts.push(
      'PROMOCIONES VIGENTES:\n' +
        data.promotions
          .map((x) => {
            const precio = x.promoPrice != null ? ` a ${money(x.promoPrice)}` : '';
            const hasta = x.endsOn ? ` (hasta ${x.endsOn})` : '';
            const cond = x.conditions ? `. Condiciones: ${x.conditions}` : '';
            return `- ${x.product}${precio}${hasta}${cond}`;
          })
          .join('\n'),
    );
  } else {
    parts.push('PROMOCIONES VIGENTES: ninguna publicada por ahora.');
  }
  if (data.faqs.length) {
    parts.push('PREGUNTAS FRECUENTES:\n' + data.faqs.map((f) => `P: ${f.question}\nR: ${f.answer}`).join('\n'));
  }
  return parts.join('\n\n');
}

export { DAY_NAMES };
