import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Lazy init: idempotente, seguro en serverless (Vercel cold starts)
let dbReady = false;
async function ensureDB() {
  if (dbReady) return;
  await db.execute(`CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS user_config (
    user_id TEXT PRIMARY KEY,
    cfg_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS user_state (
    user_id TEXT PRIMARY KEY,
    state_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`);
  dbReady = true;
}

app.use(async (_req, _res, next) => {
  try { await ensureDB(); next(); }
  catch (e) { console.error('DB init error:', e.message); next(e); }
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const existing = await db.execute({ sql: 'SELECT user_id FROM users WHERE user_id = ?', args: [userId] });
    if (existing.rows.length > 0) return res.json({ created: false, exists: true });
    await db.execute({ sql: 'INSERT INTO users (user_id) VALUES (?)', args: [userId] });
    return res.json({ created: true });
  } catch (e) {
    console.error('register error:', e.message);
    return res.status(500).json({ error: 'server error' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const result = await db.execute({ sql: 'SELECT user_id FROM users WHERE user_id = ?', args: [userId] });
    return res.json({ ok: result.rows.length > 0 });
  } catch (e) {
    console.error('login error:', e.message);
    return res.status(500).json({ error: 'server error' });
  }
});

// GET /api/data/:userId
app.get('/api/data/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [cfgRow, stateRow] = await Promise.all([
      db.execute({ sql: 'SELECT cfg_json FROM user_config WHERE user_id = ?', args: [userId] }),
      db.execute({ sql: 'SELECT state_json FROM user_state WHERE user_id = ?', args: [userId] }),
    ]);
    const cfg   = cfgRow.rows.length   > 0 ? JSON.parse(cfgRow.rows[0].cfg_json)     : null;
    const state = stateRow.rows.length > 0 ? JSON.parse(stateRow.rows[0].state_json) : null;
    return res.json({ cfg, state });
  } catch (e) {
    console.error('data error:', e.message);
    return res.status(500).json({ error: 'server error' });
  }
});

// PUT /api/config/:userId
app.put('/api/config/:userId', async (req, res) => {
  const { userId } = req.params;
  const { cfg } = req.body;
  if (!cfg) return res.status(400).json({ error: 'cfg required' });
  try {
    await db.execute({
      sql: `INSERT OR REPLACE INTO user_config (user_id, cfg_json, updated_at) VALUES (?, ?, datetime('now'))`,
      args: [userId, JSON.stringify(cfg)],
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error('config error:', e.message);
    return res.status(500).json({ error: 'server error' });
  }
});

// PUT /api/state/:userId
app.put('/api/state/:userId', async (req, res) => {
  const { userId } = req.params;
  const { state } = req.body;
  if (!state) return res.status(400).json({ error: 'state required' });
  try {
    await db.execute({
      sql: `INSERT OR REPLACE INTO user_state (user_id, state_json, updated_at) VALUES (?, ?, datetime('now'))`,
      args: [userId, JSON.stringify(state)],
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error('state error:', e.message);
    return res.status(500).json({ error: 'server error' });
  }
});

// Local dev
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
