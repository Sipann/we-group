'use strict';

import pool from '../models';

export async function createTables () {

  try {
    console.log('CREATE TABLES => START');

    await pool.query('BEGIN');

    await pool.query(`CREATE TYPE MODE AS ENUM('phone', 'email');`);
    await pool.query(`CREATE TYPE STATUS AS ENUM('pending', 'ongoing', 'done');`);

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
      manager_id TEXT REFERENCES users (id)
    );`);

    await pool.query(`CREATE TABLE groupsusers (
      id BIGSERIAL PRIMARY KEY,
      group_id BIGINT REFERENCES groups (id),
      user_id TEXT REFERENCES users (id),
      joined TIMESTAMPTZ,
      has_left TIMESTAMPTZ
    );`);

    await pool.query(`CREATE TABLE items(
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      description VARCHAR(70),
      price NUMERIC(6,2),
      group_id BIGINT REFERENCES groups (id)
    );`);

    await pool.query(`CREATE TABLE available_orders(
      id BIGSERIAL PRIMARY KEY,
      deadline_ts TIMESTAMPTZ,
      delivery_ts TIMESTAMPTZ,
      delivery_status STATUS,
      confirmed_status BOOLEAN,
      group_id BIGINT REFERENCES groups (id)
    );`);

    await pool.query(`CREATE TABLE placed_orders(
      id BIGSERIAL PRIMARY KEY,
      group_id BIGINT REFERENCES groups (id),
      user_id TEXT REFERENCES users (id),
      available_order_id BIGINT REFERENCES available_orders (id)
    );`);

    await pool.query(` CREATE TABLE available_items (
      id BIGSERIAL PRIMARY KEY,
      item_id BIGINT REFERENCES items (id),
      initial_qty INTEGER,
      remaining_qty INTEGER,
      available_order_id BIGINT REFERENCES available_orders (id)
    );`);


    await pool.query(`CREATE TABLE ordered_items (
      id BIGSERIAL PRIMARY KEY,
      quantity INTEGER NOT NULL,
      item_id BIGINT REFERENCES items (id),
      placed_order_id BIGINT REFERENCES placed_orders (id),
      available_item_id BIGINT REFERENCES available_items (id),
      available_order_id BIGINT REFERENCES available_orders (id)
    );`);

    await pool.query('COMMIT');

    console.log('CREATE TABLES => END OK');

  } catch (error) {
    await pool.query('ROLLBACK');
    console.log('CREATE TABLES => ERROR', error.message);
  }

};

createTables();