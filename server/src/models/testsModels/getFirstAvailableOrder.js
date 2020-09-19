'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function getFirstAvailableOrder () {
  try {
    const response = await pool.query(`SELECT * FROM available_orders ORDER BY id LIMIT 1;`);
    return { ok: true, payload: response.rows[0] };
  } catch (error) {
    return handleErrorModel(error);
  }
}