'use strict';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import pool from '..';



export async function isUserRemovable (userid, groupid) {
  try {
    // console.log('MODELS userid =>', userid, 'groupid =>', groupid);
    const queryStr = `
      SELECT
        placed_orders.id,
        available_orders.delivery_status
      FROM placed_orders
      INNER JOIN available_orders
        ON placed_orders.available_order_id = available_orders.id
        AND placed_orders.user_id = $1
        AND placed_orders.group_id = $2
        AND available_orders.delivery_status <> $3;`;

    const response = await pool.query(queryStr, [userid, groupid, 'done']);
    // console.log('MODELS response =>', response.rows);

    if (response.rows?.length) return { ok: true, payload: false };
    else if (response.rows) return { ok: true, payload: true };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}