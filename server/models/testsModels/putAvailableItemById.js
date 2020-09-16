'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function putAvailableItemById (availableitemid, remainingqty) {
  try {
    const response = await pool.query(
      `UPDATE available_items
        SET remaining_qty = $2
      WHERE id = $1
      RETURNING *;`,
      [availableitemid, remainingqty]
    );
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}
