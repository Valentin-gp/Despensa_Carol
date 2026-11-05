import type { BusinessHour, BusinessProfile, Faq, PaymentMethod, Promotion, ServiceItem, SiteData } from '../../shared/types';

export async function loadSiteData(db: D1Database): Promise<SiteData> {
  const [p, h, s, pm, f, pr] = await db.batch([
    db.prepare(
      `SELECT name, tagline, description, address, address_reference AS addressReference, city, phone, whatsapp,
              maps_url AS mapsUrl, facebook_url AS facebookUrl, latitude, longitude, updated_at AS updatedAt
       FROM business_profile WHERE id = 1`,
    ),
    db.prepare(`SELECT day_of_week AS dayOfWeek, opens, closes, closed, note FROM business_hours ORDER BY day_of_week`),
    db.prepare(`SELECT id, kind, name, description FROM services WHERE active = 1 ORDER BY kind, sort_order, id`),
    db.prepare(`SELECT id, code, name, description, detail FROM payment_methods WHERE active = 1 ORDER BY sort_order, id`),
    db.prepare(`SELECT id, question, answer, category FROM faqs WHERE active = 1 ORDER BY id`),
    db.prepare(
      `SELECT id, product, title, body, regular_price AS regularPrice, promo_price AS promoPrice,
              starts_on AS startsOn, ends_on AS endsOn, conditions
       FROM promotions
       WHERE status = 'published'
         AND (starts_on IS NULL OR starts_on <= date('now', '-3 hours'))
         AND (ends_on IS NULL OR ends_on >= date('now', '-3 hours'))
       ORDER BY ends_on IS NULL, ends_on, id DESC`,
    ),
  ]);

  const profile = p.results[0] as unknown as BusinessProfile | undefined;
  if (!profile) throw new Error('business_profile vacío: aplicá las migraciones');

  return {
    profile,
    hours: (h.results as unknown as (Omit<BusinessHour, 'closed'> & { closed: number })[]).map((r) => ({ ...r, closed: r.closed === 1 })),
    services: s.results as unknown as ServiceItem[],
    paymentMethods: pm.results as unknown as PaymentMethod[],
    faqs: f.results as unknown as Faq[],
    promotions: pr.results as unknown as Promotion[],
  };
}
