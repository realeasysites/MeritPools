const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db/database');
const { notifyNewLead } = require('../lib/mailer');

const router = express.Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false });

const clean = (v, max = 500) => String(v || '').trim().slice(0, max);

router.post('/quote', limiter, async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot
  const lead = {
    name: clean(b.name, 120), phone: clean(b.phone, 40), email: clean(b.email, 160), town: clean(b.town, 80),
    pool_type: clean(b.pool_type, 40), service: clean(b.service, 80), liner_pattern: clean(b.liner_pattern, 80),
    message: clean(b.message, 2000),
  };
  if (!lead.name || !lead.phone) return res.status(400).json({ error: 'Please include your name and phone number.' });
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return res.status(400).json({ error: 'That email address doesn’t look right.' });

  db.prepare(`INSERT INTO leads (name, phone, email, town, pool_type, service, liner_pattern, message)
              VALUES (@name, @phone, @email, @town, @pool_type, @service, @liner_pattern, @message)`).run(lead);
  notifyNewLead(lead);
  res.json({ ok: true });
});

module.exports = router;
