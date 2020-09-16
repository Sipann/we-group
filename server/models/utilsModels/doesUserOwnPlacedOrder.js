'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function doesUserOwnPlacedOrder (userid, placedOrderId) {
  try {
    const response = await pool.query(
      `SELECT user_id FROM placed_orders WHERE id = $1`,
      [placedOrderId]
    );

    if (response.rows?.length) return { ok: true, payload: response.rows[0].user_id === userid };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}