'use strict';
const { Pool } = require('pg');
const logger   = require('../utils/logger');

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false }
    : {
        host:     process.env.DB_HOST     || 'localhost',
        port:     parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_NAME     || 'examflow',
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }
);

pool.on('error', (err) => logger.error('Database pool error', { err: err.message }));

module.exports = { query: (text, params) => pool.query(text, params), pool };
