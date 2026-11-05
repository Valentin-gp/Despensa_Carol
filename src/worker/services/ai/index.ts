import type { Env } from '../../env';
import { FakeProvider } from './fake';
import type { AIProvider } from './provider';
import { WorkersAiProvider } from './workersAi';

export function getProvider(env: Env): AIProvider {
  if (env.AI_PROVIDER === 'workers-ai') return new WorkersAiProvider(env.AI, env.AI_MODEL);
  return new FakeProvider();
}

export * from './provider';
