'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function isAvailableOrderIdValid (availableorderid) {
  try {
    if (!availableorderid) throw new Error(errorMessages.invalidInput);

    const response = await pool.query(
      `SELECT * FROM available_orders WHERE id = $1`,
      [availableorderid]
    );
    if (response.rows?.length) return { ok: true, payload: true };
    else if (response.rows?.length === 0) return { ok: true, payload: false };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}