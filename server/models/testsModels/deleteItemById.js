'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteItemById (itemid) {
  try {
    await pool.query(
      `DELETE FROM items WHERE id = $1;`,
      [itemid]
    );
    return { ok: true, payload: true };
  } catch (error) {
    return handleErrorModel(error);
  }
}