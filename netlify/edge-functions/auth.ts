/**
 * Edge Function d'accès (plan gratuit) : gate par mot de passe avant de servir l'app.
 *
 * - Variable d'environnement requise côté Netlify : SITE_PASSWORD (le mot de passe visiteur)
 *   et AUTH_SECRET (chaîne aléatoire pour signer le cookie, ex. 32 caractères).
 * - Sans cookie valide : page HTML de saisie (POST /__auth) — aucun contenu de l'app servi.
 * - Cookie signé HMAC-SHA256, valable 7 jours, HttpOnly, Secure, SameSite=Strict.
 *
 * L'app elle-même a en plus son propre verrou code 4 chiffres (hash local) — 2 couches.
 */

const COOKIE = 'foxling_auth';
const TTL = 7 * 24 * 3600;

async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Foxling 🔒</title>
<style>body{font-family:system-ui,sans-serif;background:linear-gradient(180deg,#fff3e6,#ffe0c2);display:flex;align-items:center;justify-content:center;height:100vh;margin:0}form{background:#fff;border:4px solid #ffd8a8;border-radius:24px;padding:32px;display:flex;flex-direction:column;gap:14px;width:min(90vw,340px);text-align:center}h1{margin:0;color:#f2701d}input{font-size:1.4rem;padding:12px;border-radius:12px;border:3px solid #ffd8a8;text-align:center;letter-spacing:.3em}button{font-size:1.2rem;font-weight:800;color:#fff;background:linear-gradient(180deg,#ff9a4d,#f2701d);border:none;border-radius:999px;padding:14px;cursor:pointer}.err{color:#e03131;font-weight:700}</style></head>
<body><form method="POST" action="/__auth"><h1>🦊 Foxling</h1><p>Enter the password</p>
<input type="password" name="pw" inputmode="numeric" autocomplete="off" autofocus>
<button type="submit">Unlock 🔓</button>{ERR}</form></body></html>`;

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const url = new URL(request.url);
  const password = Deno.env.get('SITE_PASSWORD') ?? '';
  const secret = Deno.env.get('AUTH_SECRET') ?? '';

  // 1) endpoint de login
  if (url.pathname === '/__auth' && request.method === 'POST') {
    const form = await request.formData();
    const pw = String(form.get('pw') ?? '');
    if (password && pw === password) {
      const exp = Math.floor(Date.now() / 1000) + TTL;
      const payload = `${exp}`;
      const sig = await sign(payload, secret || 'dev-secret-change-me');
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': `${COOKIE}=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${TTL}`,
        },
      });
    }
    return new Response(PAGE.replace('{ERR}', '<p class="err">Wrong password</p>'), {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // 2) si pas de mot de passe configuré, on laisse passer (mode dev)
  if (!password) return context.next();

  // 3) vérifie le cookie
  const cookie = request.headers.get('cookie') ?? '';
  const m = cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
  if (m) {
    const [payload, sig] = m[1].split('.');
    const expected = await sign(payload, secret || 'dev-secret-change-me');
    const exp = Number(payload);
    if (sig === expected && exp * 1000 > Date.now()) {
      return context.next();
    }
  }

  // 4) non authentifié → page de saisie, aucun contenu servi
  return new Response(PAGE.replace('{ERR}', ''), {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};

export const config = { path: '/*' };
