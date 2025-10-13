import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'vpwa';

async function ensureDatabase() {
  const admin = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await admin.end();
}

async function runMigrations() {
  await ensureDatabase();
  const pool = await mysql.createPool({
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      name VARCHAR(255) PRIMARY KEY,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [appliedRows] = await pool.query('SELECT name FROM migrations');
  const applied = new Set(Array.isArray(appliedRows) ? appliedRows.map((r) => r.name) : []);

  const migrationsDir = path.join(process.cwd(), 'API', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found.');
    process.exit(0);
  }
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
      process.exit(1);
    }
  }

  await pool.end();
  console.log('Migrations complete');
}

runMigrations();


