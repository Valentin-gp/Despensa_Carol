import type { AIMessage, AIProvider } from './provider';

/** Proveedor de prueba: no gasta Neurons. Sirve para probar toda la interfaz. */
export class FakeProvider implements AIProvider {
  readonly name = 'fake';
  readonly model = 'fake';
  async generate(messages: AIMessage[]): Promise<string> {
    const last = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
    return `[Modo de prueba] Recibí tu consulta: "${last.slice(0, 120)}". Cuando se active la IA real, voy a responder con la información de la despensa.`;
  }
}
