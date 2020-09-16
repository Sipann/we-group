'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteAvailableItemById (availableitemid) {
  try {
    await pool.query(
      `DELETE FROM available_items WHERE id = $1;`,
      [availableitemid]
    );
    return { ok: true, payload: true };
  } catch (error) {
    return handleErrorModel(error);
  }
}