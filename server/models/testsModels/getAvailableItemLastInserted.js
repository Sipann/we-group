'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';

export async function getAvailableItemLastInserted () {
  try {
    const response = await pool.query('SELECT * FROM available_items ORDER BY id DESC LIMIT 1;');
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);
  } catch (error) {
    return handleErrorModel(error);
  }
}