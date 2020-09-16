'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function fetchGroupPlacedOrders (availableOrderId) {
  try {

    const queryStr = `
      SELECT
        placed_orders.id as placed_order_id,
        available_orders.id as available_order_id,
        available_orders.deadline_ts as deadline_ts,
        available_orders.delivery_ts as delivery_ts,
        available_orders.delivery_status as delivery_status,
        available_orders.confirmed_status as confirmed_status,

        users.name as user_name,
        ordered_items.item_id as item_id,
        ordered_items.quantity as quantity,
        items.name as item_name,
        items.description as item_description,
        items.price as item_price

      FROM available_orders
      JOIN placed_orders
        ON placed_orders.available_order_id = available_orders.id
        AND placed_orders.available_order_id = $1
      JOIN ordered_items
        ON placed_orders.id = ordered_items.placed_order_id
      JOIN items
        ON ordered_items.item_id = items.id
      JOIN users
        ON placed_orders.user_id = users.id
    ;`;

    const response = await pool.query(queryStr, [availableOrderId]);
    // console.log('MODELS response =>', response.rows);
    if (response.rows.length) return { ok: true, payload: response.rows }
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}