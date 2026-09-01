// GenBionex — contact endpoint.
// Express + nodemailer. This is the only Node.js code in the project; the
// rest of the site is static HTML/CSS/JS and can be served by any host.
// Run: npm install && npm start (see .env.example for required variables).

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
const TO_EMAIL = process.env.TO_EMAIL || 'info@genbionex.ug';
const SITE_ROOT = path.join(__dirname, '..');

const DATA_DIR = path.join(__dirname, 'data');
const COUNT_FILE = path.join(DATA_DIR, 'contact-count.json');

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // requests per window per IP
const requestLog = new Map(); // ip -> [timestamps]

const FIELD_LIMITS = {
  name: 120,
  email: 254,
  organisation: 160,
  district: 120,
  enterprise: 160,
  service: 160,
  message: 4000
};
const REQUIRED_FIELDS = ['name', 'email', 'district', 'message'];
const MAX_SERVICE_ITEMS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHAR_RE = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.static(SITE_ROOT, { extensions: ['html'] }));

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  requestLog.set(ip, hits);
  return hits.length > RATE_LIMIT_MAX;
}

function sanitize(value, maxLength) {
  if (typeof value !== 'string') return '';
  // Collapse newlines to spaces and drop other control characters — a
  // header-injection guard for any field that ends up in an email header
  // (e.g. replyTo) — then cap length.
  const noNewlines = value.split('\r\n').join(' ').split('\n').join(' ').split('\r').join(' ');
  const noControl = noNewlines.replace(CONTROL_CHAR_RE, '');
  return noControl.trim().slice(0, maxLength);
}

function sanitizeList(values, maxItemLength, maxItems) {
  const arr = Array.isArray(values) ? values : (values ? [values] : []);
  return arr.map((v) => sanitize(v, maxItemLength)).filter(Boolean).slice(0, maxItems);
}

function readContactCount() {
  try {
    const parsed = JSON.parse(fs.readFileSync(COUNT_FILE, 'utf8'));
    return Number.isFinite(parsed.count) ? parsed.count : 0;
  } catch (err) {
    return 0;
  }
}

function incrementContactCount() {
  const count = readContactCount() + 1;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(COUNT_FILE, JSON.stringify({ count }));
  } catch (err) {
    console.error('contact counter write failed:', err.message);
  }
  return count;
}

function validate(body) {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (!sanitize(body[field], FIELD_LIMITS[field] || 200)) {
      errors.push('"' + field + '" is required.');
    }
  }
  const email = sanitize(body.email, FIELD_LIMITS.email);
  if (email && !EMAIL_RE.test(email)) {
    errors.push('"email" must be a valid email address.');
  }
  return errors;
}

function buildTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

app.post('/api/contact', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
  }

  const body = req.body || {};

  // Honeypot: bots fill every field, including this hidden one. Real
  // visitors never see it. Reply 200 so the bot doesn't learn to retry.
  if (sanitize(body.company_site, 200)) {
    return res.status(200).json({ ok: true });
  }

  const errors = validate(body);
  if (errors.length) {
    return res.status(400).json({ ok: false, error: errors.join(' ') });
  }

  const fields = {};
  for (const key of Object.keys(FIELD_LIMITS)) {
    if (key === 'service') continue;
    fields[key] = sanitize(body[key], FIELD_LIMITS[key]);
  }
  fields.service = sanitizeList(body.service, FIELD_LIMITS.service, MAX_SERVICE_ITEMS);

  const text = [
    'Name: ' + fields.name,
    'Email: ' + fields.email,
    'Organisation: ' + (fields.organisation || '—'),
    'District: ' + fields.district,
    'Enterprise: ' + (fields.enterprise || '—'),
    'Service interest: ' + (fields.service.length ? fields.service.join(', ') : '—'),
    '',
    'Message:',
    fields.message
  ].join('\n');

  try {
    const transporter = buildTransport();
    await transporter.sendMail({
      from: '"GenBionex website" <' + process.env.SMTP_USER + '>',
      to: TO_EMAIL,
      replyTo: fields.email,
      subject: 'Website enquiry from ' + fields.name,
      text: text
    });
    incrementContactCount();
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact form send failed:', err.message);
    return res.status(502).json({ ok: false, error: 'Could not send the message. Please email us directly.' });
  }
});

app.get('/api/contact/count', (req, res) => {
  res.status(200).json({ count: readContactCount() });
});

app.listen(PORT, () => {
  console.log('GenBionex site + contact endpoint listening on port ' + PORT);
});
