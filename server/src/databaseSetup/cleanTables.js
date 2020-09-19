'use strict';

import pool from '../models';

export async function cleanTables () {

  try {
    console.log('CLEAN TABLES => START');

    await pool.query('BEGIN');

    await pool.query(`DELETE FROM ordered_items;`);
    await pool.query(`DELETE FROM available_items;`);
    await pool.query(`DELETE FROM placed_orders;`);
    await pool.query(`DELETE FROM available_orders;`);
    await pool.query(`DELETE FROM items;`);
    await pool.query(`DELETE FROM groupsusers;`);
    await pool.query(`DELETE FROM groups;`);
    await pool.query(`DELETE FROM users;`);

    await pool.query('COMMIT');

    console.log('CLEAN TABLES => END OK');

  } catch (error) {
    await pool.query('ROLLBACK');
    console.log('CLEAN TABLES => ERROR', error.message);
  }
}

cleanTables();