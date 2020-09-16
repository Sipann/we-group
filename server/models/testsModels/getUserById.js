'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function getUserById (userid) {
  try {
    const response = await pool.query(
      `SELECT * FROM users WHERE id = $1;`,
      [userid]
    );
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}