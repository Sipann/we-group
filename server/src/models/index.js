const { Pool } = require('pg');

const envConfigs = require('../config');
const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];

const pool = new Pool({
  user: config.DB_USERNAME,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT
});


export default pool;