const express = require('express');
const path = require('path');
const db = require('../db/database');
const { checkCredentials, login, logout, requireAuth } = require('../lib/auth');

const router = express.Router();
const STATUSES = ['new', 'contacted', 'quoted', 'scheduled', 'won', 'lost'];

router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'login.html')));
router.post('/login', (req, res) => {
  if (checkCredentials(req.body.username, req.body.password)) { login(res); return res.redirect('/admin'); }
  return res.redirect('/admin/login?error=1');
});
router.post('/logout', (req, res) => { logout(res); res.redirect('/admin/login'); });

router.get('/', requireAuth, (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'admin.html')));

router.get('/api/leads', requireAuth, (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  leads.forEach((l) => { counts[l.status] = (counts[l.status] || 0) + 1; });
  res.json({ leads, counts, statuses: STATUSES });
});

router.patch('/api/leads/:id', requireAuth, (req, res) => {
  const { status, notes } = req.body || {};
  if (status && !STATUSES.includes(status)) return res.status(400).json({ error: 'Bad status' });
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE leads SET status = ?, notes = ? WHERE id = ?')
    .run(status || lead.status, notes !== undefined ? String(notes).slice(0, 2000) : lead.notes, lead.id);
  res.json({ ok: true });
});

router.delete('/api/leads/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
