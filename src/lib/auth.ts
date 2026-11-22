// Signed admin session token (HMAC-SHA256 via Web Crypto — works in proxy and route handlers)
export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day

const enc = new TextEncoder();

function getSecret() {
  const secret = process.env.SESSION_SECRET || process.env.MONGODB_URI;
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  return secret;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function createSessionToken(userId: string) {
  const payload = `${userId}.${Date.now() + SESSION_MAX_AGE * 1000}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [userId, exp, sig] = parts;
  if (!userId || Number(exp) < Date.now()) return false;
  const expected = await hmac(`${userId}.${exp}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export const sessionCookieOptions = {
  path: '/',
  maxAge: SESSION_MAX_AGE,
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
};
