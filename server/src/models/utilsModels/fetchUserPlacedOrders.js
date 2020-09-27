'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';

export async function fetchUserPlacedOrders (userid) {
  try {
    const queryStr = `
      SELECT
        placed_orders.id as order_id,
        placed_orders.user_id as user_id,
        placed_orders.group_id as group_id,
        ordered_items.quantity as item_ordered_quantity,
        available_orders.deadline_ts as order_deadline_ts,
        available_orders.delivery_ts as order_delivery_ts,
        available_orders.delivery_status as order_delivery_status,
        available_orders.confirmed_status as order_confirmed_status,
        groups.name as group_name,
        items.id as item_id,
        items.name as item_name,
        items.price as item_price

      FROM placed_orders

      JOIN ordered_items
        ON ordered_items.placed_order_id = placed_orders.id
        AND placed_orders.user_id = $1

      LEFT JOIN available_orders
        ON placed_orders.available_order_id = available_orders.id

      LEFT JOIN groups
        ON placed_orders.group_id = groups.id

      LEFT JOIN items
        ON ordered_items.item_id = items.id;

    `;

    const response = await pool.query(queryStr, [userid]);
    if (response.rows) return { ok: true, payload: response.rows };
    else throw new Error(errorMessages.internalServerError);
    n
  } catch (error) {
    return handleErrorModel(error);
  }
}
