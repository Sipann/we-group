'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteAvailableOrderById (availableorderid) {
  try {
    await pool.query(
      `DELETE FROM available_orders WHERE id = $1;`,
      [availableorderid]
    );

    return { ok: true, payload: true };

  } catch (error) {
    return handleErrorModel(error);
  }
}