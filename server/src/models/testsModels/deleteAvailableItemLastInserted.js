'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteAvailableItemLastInserted () {
  try {
    const response = await pool.query('DELETE FROM available_items ORDER BY id DESC LIMIT 1;');
    return { ok: true, payload: true };
  } catch (error) {
    return handleErrorModel(error);
  }
}