'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function getItemById (itemid) {
  try {
    const response = await pool.query(
      `SELECT * FROM items WHERE id = $1;`,
      [itemid]
    );
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}