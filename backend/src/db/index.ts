import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

(async () => {
  try {
    const res = await pool.query(
      "SELECT current_database(), inet_server_addr(), inet_server_port()"
    );
    console.log("✅ Connected to DB:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB connection test failed:", err);
  }
})();
