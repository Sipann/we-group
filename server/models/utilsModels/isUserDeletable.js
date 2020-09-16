'use strict';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import pool from '..';



export async function isUserDeletable (userid) {
  try {

    const queryStr = `
      SELECT
        placed_orders.id,
        available_orders.delivery_status
      FROM placed_orders
      INNER JOIN available_orders
        ON placed_orders.available_order_id = available_orders.id
        AND placed_orders.user_id = $1
        AND available_orders.delivery_status <> $2;`;

    const response = await pool.query(queryStr, [userid, 'done']);
    // console.log('MODELS response =>', response.rows);

    if (response.rows?.length) return { ok: true, payload: false };
    else if (response.rows) return { ok: true, payload: true };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}