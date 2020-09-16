'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchPlacedOrder (placedOrderId) {
  try {
    // console.log('MODELS FETCH PLACED ORDER =>', placedOrderId);
    // const queryStr = `
    //   SELECT
    //     placed_orders.id as placed_order_id,
    //     placed_orders.group_id as group_id,
    //     available_orders.deadline_ts as deadline_ts,
    //     available_orders.delivery_ts as delivery_ts,
    //     available_orders.delivery_status as delivery_status,
    //     available_orders.confirmed_status as confirmed_status,
    //     ordered_items.quantity as quantity,
    //     items.name as item_name,
    //     items.description as item_description,
    //     items.price as item_price
    //   FROM placed_orders
    //   JOIN available_orders
    //     ON placed_orders.available_order_id = available_orders.id
    //     AND available_orders.id = $1
    //   LEFT JOIN ordered_items
    //     ON placed_orders.id = ordered_items.placed_order_id
    //   LEFT JOIN items
    //     ON items.id = ordered_items.item_id
    // `;

    const queryStr = `
      SELECT
        placed_orders.id as placed_order_id,
        placed_orders.group_id as group_id,
        available_orders.deadline_ts as deadline_ts,
        available_orders.delivery_ts as delivery_ts,
        available_orders.delivery_status as delivery_status,
        available_orders.confirmed_status as confirmed_status,
        ordered_items.quantity as quantity,
        items.name as item_name,
        items.description as item_description,
        items.price as item_price
      FROM placed_orders
      JOIN available_orders
        ON placed_orders.available_order_id = available_orders.id
        AND placed_orders.id = $1
      LEFT JOIN ordered_items
        ON placed_orders.id = ordered_items.placed_order_id
      LEFT JOIN items
        ON items.id = ordered_items.item_id
    `;

    const response = await pool.query(queryStr, [placedOrderId]);
    // console.log('MODELS FETCH PLACED ORDER response.rows =>', response.rows);

    if (response.rows?.length) {
      const { placed_order_id, group_id, deadline_ts, delivery_ts, delivery_status, confirmed_status } = response.rows[0];
      const mapped = {
        placed_order_id,
        group_id,
        deadline_ts,
        delivery_ts,
        delivery_status,
        confirmed_status,
        ordered_items: response.rows.map(({ quantity, item_name, item_description, item_price }) => ({
          itemQty: quantity, itemName: item_name, itemDescription: item_description, itemPrice: item_price
        })),
      }
      // console.log('MODELS FETCH PLACED ORDER mapped =>', mapped);
      return { ok: true, payload: mapped }
    }
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
