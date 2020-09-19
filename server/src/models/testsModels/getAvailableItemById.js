'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function getAvailableItemById (availableitemid) {
  try {
    const response = await pool.query(
      `SELECT * FROM available_items WHERE id = $1;`,
      [availableitemid]
    );
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}