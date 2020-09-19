'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchAvailableOrderItems (orderid) {
  try {
    const queryStr = `
      SELECT
        available_items.id as available_item_id,
        available_items.initial_qty as available_item_initial_qty,
        available_items.remaining_qty as available_item_remaining_qty,
        items.id as item_id,
        items.name as item_name,
        items.description as item_description,
        items.price as item_price
      FROM available_items
      JOIN items
        ON available_items.item_id = items.id
        AND available_items.available_order_id = $1;
    `;
    const response = await pool.query(queryStr, [orderid]);

    if (response.rows) return { ok: true, payload: response.rows };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
