// Simple auth API server using Express, JWT, and file-based storage
// Run with: node API/API.js (after installing deps in API/package.json)

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// MySQL pool
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'vpwa';

let pool;
async function initDb() {
  // One-off admin connection to create DB
  const admin = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await admin.end();

  // Pool bound to target database
  pool = await mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  });
}

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) return; // no migrations present

  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      name VARCHAR(255) PRIMARY KEY,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [appliedRows] = await pool.query('SELECT name FROM migrations');
  const applied = new Set(Array.isArray(appliedRows) ? appliedRows.map((r) => r.name) : []);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    try {
      await pool.query(sql);
      await pool.query('INSERT INTO migrations (name) VALUES (?)', [file]);
      console.log(`Applied migration: ${file}`);
    } catch (err) {
      console.error(`Failed migration ${file}`, err);
      throw err;
    }
  }
}

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:9000', // Quasar default dev port
      'http://localhost:5173', // Vite default
      'http://127.0.0.1:9000',
      'http://127.0.0.1:5173',
    ],
    credentials: false,
  })
);

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password required' });
  }
  try {
    const [existingRows] = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );
    const exists = Array.isArray(existingRows) && existingRows.length > 0;
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const id = cryptoRandomId();
    const passwordHash = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, name, email, passwordHash]
    );
    const token = generateToken({ id, name, email });
    res.status(201).json({ token, user: { id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password required' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );
    const userRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!userRow) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = bcrypt.compareSync(password, userRow.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken({ id: userRow.id, name: userRow.name, email: userRow.email });
    res.json({ token, user: { id: userRow.id, name: userRow.name, email: userRow.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Me
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    const userRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!userRow) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: userRow.id, name: userRow.name, email: userRow.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

initDb()
  .then(() => {
    return runMigrations();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Auth API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database', err);
    process.exit(1);
  });

function cryptoRandomId() {
  // Use Node crypto to generate a compact ID (uuid alternative)
  return (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 24);
}


