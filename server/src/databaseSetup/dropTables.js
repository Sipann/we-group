'use strict';

import pool from '../models';

export async function dropTables () {

  try {
    console.log('DROP TABLES => START');

    await pool.query('BEGIN');

    await pool.query('DROP TABLE ordered_items;');
    await pool.query('DROP TABLE available_items;');
    await pool.query('DROP TABLE placed_orders;');
    await pool.query('DROP TABLE available_orders;');
    await pool.query('DROP TABLE items;');
    await pool.query('DROP TABLE groupsusers;');
    await pool.query('DROP TABLE groups;');
    await pool.query('DROP TABLE users;');

    await pool.query('DROP TYPE MODE;');
    await pool.query('DROP TYPE STATUS');

    await pool.query('COMMIT');

    console.log('DROP TABLES => END OK');

  } catch (error) {
    await pool.query('ROLLBACK');
    console.log('DROP TABLES => ERROR', error.message);
  }
}

dropTables();