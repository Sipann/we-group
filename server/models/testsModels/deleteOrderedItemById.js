'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteOrderedItemById (ordereditemid) {
  try {
    await pool.query(
      `DELETE FROM ordered_items WHERE id = $1;`,
      [ordereditemid]
    );
    return { ok: true, payload: true };
  } catch (error) {
    return handleErrorModel(error);
  }
}