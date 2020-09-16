'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deletePlacedOrderById (placedorderid) {
  try {
    await pool.query(
      `DELETE FROM placed_orders WHERE id = $1;`,
      [placedorderid]
    );
    return { ok: true, payload: true };
  } catch (error) {
    return handleErrorModel(error);
  }
}