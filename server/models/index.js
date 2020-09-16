import { Pool } from 'pg';

// PREVIOUS
// const { user, host, database, password, port } = require('../config').db;

// const pool = new Pool({
//   user,
//   host,
//   database,
//   password,
//   port
// });

// NEW
import envConfigs from '../config';
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