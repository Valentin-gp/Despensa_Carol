INSERT INTO business_profile (id, name, tagline, description, address, address_reference, city, phone, whatsapp, maps_url, facebook_url, latitude, longitude)
VALUES (
  1,
  'Despensa Carol',
  'Tu despensa de confianza',
  'Despensa de barrio en Luque. Lácteos, bebidas heladas, productos cárnicos, panificados, bazar y recarga telefónica.',
  'Av. Las Residentas 1466',
  'Sobre la calle La Milagrosa y 1 de Mayo',
  'Luque, Paraguay',
  '0972 294 463',
  '595972294463',
  'https://www.google.com/maps?q=-25.286048466420816,-57.459809967371164',
  'https://www.facebook.com/p/Despensa-Carol-100089325339770/',
  -25.286048466420816,
  -57.459809967371164
);

INSERT INTO business_hours (day_of_week, opens, closes, closed, note) VALUES
  (0, '07:00', '18:00', 0, ''),
  (1, '07:00', '21:00', 0, ''),
  (2, '07:00', '21:00', 0, ''),
  (3, '07:00', '21:00', 0, ''),
  (4, '07:00', '21:00', 0, ''),
  (5, '07:00', '21:00', 0, ''),
  (6, '07:00', '21:00', 0, '');

INSERT INTO payment_methods (code, name, description, detail, sort_order) VALUES
  ('efectivo', 'Efectivo', 'Pagá en guaraníes, como siempre.', '', 1),
  ('tarjeta', 'Tarjeta', 'Débito y crédito con POS.', 'Visa, Mastercard, Maestro, Cabal, Panal, Único, American Express y más', 2),
  ('qr', 'Pago con QR', 'Pagá desde tu celular.', 'Bancard QR, Coop, Dimo y billeteras digitales', 3);

INSERT INTO services (kind, name, description, sort_order) VALUES
  ('servicio', 'Recarga telefónica', 'Tigo, Personal y Claro.', 1),
  ('rubro', 'Lácteos', '', 1),
  ('rubro', 'Bebidas heladas', '', 2),
  ('rubro', 'Productos cárnicos', '', 3),
  ('rubro', 'Panificados', '', 4),
  ('rubro', 'Bazar', '', 5);

INSERT INTO faqs (question, answer, category) VALUES
  ('¿Tienen tal producto?', 'No tenemos un inventario digital, así que no puedo confirmar si hay un producto en este momento. Consultanos por WhatsApp y te respondemos.', 'productos'),
  ('¿Hacen recargas?', 'Sí, hacemos recargas de Tigo, Personal y Claro.', 'servicios'),
  ('¿Hacen delivery?', 'No tengo información sobre delivery. Consultanos por WhatsApp.', 'servicios');
