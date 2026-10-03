const crypto = require('crypto');

const COOKIE = 'merit_admin';
const secret = () => process.env.SESSION_SECRET || 'dev-secret-change-me';

function sign(value) {
  const sig = crypto.createHmac('sha256', secret()).update(value).digest('hex');
  return `${value}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes('.')) return false;
  const [value, sig] = [token.slice(0, token.lastIndexOf('.')), token.slice(token.lastIndexOf('.') + 1)];
  const expected = crypto.createHmac('sha256', secret()).update(value).digest('hex');
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const expires = Number(value.split(':')[1]);
  return Date.now() < expires;
}

function checkCredentials(user, pass) {
  const u = process.env.ADMIN_USER || 'merit';
  const p = process.env.ADMIN_PASSWORD || 'change-me-now';
  const eq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  return eq(String(user || ''), u) && eq(String(pass || ''), p);
}

function login(res) {
  const expires = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
  res.cookie(COOKIE, sign(`admin:${expires}`), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 12,
  });
}

function logout(res) { res.clearCookie(COOKIE); }

function requireAuth(req, res, next) {
  if (verify(req.cookies[COOKIE])) return next();
  if (req.path.startsWith('/api')) return res.status(401).json({ error: 'Unauthorized' });
  return res.redirect('/admin/login');
}

module.exports = { checkCredentials, login, logout, requireAuth };
