'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteAvailableItemLastInserted () {
  try {
    // console.log('ENTERING MODEL DELETE LAST AVAILABLE ITEM INSERTED');
    const response = await pool.query('DELETE FROM available_items ORDER BY id DESC LIMIT 1;');
    // console.log('DELETE LAST INSERTED AVAILABLE ITEM =>', response);
    return { ok: true, payload: true };
  } catch (error) {
    return handleErrorModel(error);
  }
}