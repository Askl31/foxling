import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import type { UserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { handleTtsRequest } from './server/ttsCore';

interface DevRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  [Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array>;
}

interface DevResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(chunk?: Uint8Array | string): void;
}

type Middlewares = { use(path: string, handler: (req: DevRequest, res: DevResponse) => void): unknown };

// @types/node est absent : cast nommé sur globalThis, forme connue du runtime Node.
const nodeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;

function ttsEnv(mode: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(nodeProcess?.env ?? {})) {
    if (k.startsWith('MISTRAL_') && v !== undefined) env[k] = v;
  }
  return { ...env, ...loadEnv(mode, '.', 'MISTRAL_') };
}

async function serveTts(req: DevRequest, res: DevResponse, env: Record<string, string>): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Méthode non autorisée');
    return;
  }
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) chunks.push(chunk);
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const body = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    body.set(c, offset);
    offset += c.length;
  }
  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(req.headers)) if (typeof value === 'string') headers[name] = value;
  const request = new Request('http://localhost/api/tts', { method: 'POST', headers, body });
  try {
    const response = await handleTtsRequest(request, env);
    res.statusCode = response.status;
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.end(new Uint8Array(await response.arrayBuffer()));
  } catch {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'dev /api/tts: échec interne' }));
  }
}

/** Sert POST /api/tts en dev et preview (même logique que la fonction Vercel) : plus de 404 sur :5173. */
function devApiTts(): Plugin {
  const register = (middlewares: Middlewares, mode: string) => {
    const env = ttsEnv(mode);
    middlewares.use('/api/tts', (req, res) => void serveTts(req, res, env));
  };
  return {
    name: 'foxling-dev-api-tts',
    configureServer(server) {
      register(server.middlewares as Middlewares, server.config.mode);
    },
    configurePreviewServer(server) {
      register(server.middlewares as Middlewares, server.config.mode);
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiTts()],
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
} as UserConfig & { test?: unknown });
