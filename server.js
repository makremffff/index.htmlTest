// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// قاعدة بيانات بسيطة مؤقتة في الذاكرة
let users = {};

// ✅ بدء الاتصال
app.get("/api/start", (req, res) => {
  res.json({ ok: true, message: "Server is live 🚀" });
});

// ✅ Mystery Box
app.post("/api/mystery-box", (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: "Missing user" });

  const reward = Math.floor(Math.random() * (200 - 10 + 1)) + 10;
  users[user] = (users[user] || { points: 0, usdt: 0 });
  users[user].points += reward;

  res.json({ message: `🎁 You got ${reward} points`, reward });
});

// ✅ Quick Bonus
app.post("/api/quick-bonus", (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: "Missing user" });

  const reward = 500;
  users[user] = (users[user] || { points: 0, usdt: 0 });
  users[user].points += reward;

  res.json({ message: "⚡ Quick bonus added", reward });
});

// ✅ Watch Ad
app.post("/api/watch-ad", (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: "Missing user" });

  users[user] = (users[user] || { points: 0, usdt: 0 });
  users[user].points += 1;
  res.json({ message: "👁 Ad watched", newBalance: users[user].points });
});

// ✅ Swap
app.post("/api/swap", (req, res) => {
  const { user, points } = req.body;
  if (!user || !points) return res.status(400).json({ error: "Missing params" });

  const reward = (points / 10000) * 0.005;
  users[user] = (users[user] || { points: 0, usdt: 0 });

  if (users[user].points < points) return res.status(400).json({ error: "Not enough points" });

  users[user].points -= points;
  users[user].usdt += reward;
  res.json({ message: `Converted ${points} points to ${reward.toFixed(3)} USDT`, usdt: users[user].usdt });
});

// ✅ Withdraw
app.post("/api/withdraw", async (req, res) => {
  const { user, address, amount } = req.body;
  if (!user || !address || !amount)
    return res.status(400).json({ error: "Missing parameters" });

  const TG_TOKEN = "8222744961:AAE90Eehr8PqldV6oKxIS9Yo9hw69Zi83Us";
  const CHAT_ID = "8447940021";
  const msg = `🚨 Withdrawal Request\n👤 User: @${user}\n💰 Amount: ${amount} USDT\n📍 Address: ${address}`;

  try {
    const send = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
    });
    const data = await send.json();
    if (!data.ok) throw new Error("Telegram API error");

    res.json({ message: "Withdrawal sent to admin ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Claim task
app.post("/api/task/claim", (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: "Missing user" });

  const reward = 10000;
  users[user] = (users[user] || { points: 0, usdt: 0 });
  users[user].points += reward;
  res.json({ message: "🎯 Task reward claimed", reward });
});

// ✅ عرض بيانات المستخدم
app.get("/api/user/:id", (req, res) => {
  const user = req.params.id;
  res.json(users[user] || { points: 0, usdt: 0 });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));