'use strict';

const pool = require('../models');

exports.createTables = async () => {

  try {

    await pool.query(`CREATE TYPE mode AS ENUM('phone', 'email');`);

    await pool.query(`CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE,
      email VARCHAR(70) UNIQUE,
      phone VARCHAR(30) UNIQUE,
      preferred_contact_mode MODE NOT NULL
    );`);

    await pool.query(`CREATE TABLE groups (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(70) UNIQUE NOT NULL,
      description VARCHAR(180) NOT NULL,
      currency VARCHAR(3),
      manager_id TEXT REFERENCES users (id),
      deadline DATE
    );`);

    await pool.query(`CREATE TABLE groupsusers (
      id BIGSERIAL PRIMARY KEY,
      group_id BIGINT REFERENCES groups (id),
      user_id TEXT REFERENCES users (id)
    );`);

    await pool.query(`CREATE TABLE items(
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      description VARCHAR(70),
      price NUMERIC(6,2),
      currency VARCHAR(3),
      initial_qty INTEGER,
      remaining_qty INTEGER,
      group_id BIGINT REFERENCES groups (id)
    );`);

    await pool.query(`CREATE TABLE orders(
      id BIGSERIAL PRIMARY KEY,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      total_price NUMERIC(6,2),
      total_currency VARCHAR(3),
      group_id BIGINT REFERENCES groups (id),
      user_id TEXT REFERENCES users (id)
    );`);

    await pool.query(`CREATE TABLE ordered_items (
      id BIGSERIAL PRIMARY KEY,
      quantity INTEGER NOT NULL,
      item_id BIGINT REFERENCES items (id),
      order_id BIGINT REFERENCES orders (id)
    );`);


  } catch (error) {
    console.log('[createTables error]', error.message);
  }

};
