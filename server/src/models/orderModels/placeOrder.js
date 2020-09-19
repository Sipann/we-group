'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function placeOrder (userid, availableorder, itemsOrdered) {
  try {

    const { group_id: groupId, id: availableOrderId } = availableorder;

    await pool.query('BEGIN');

    // INSERT INTO placed_orders table
    const placedOrderQueryStr = `
        INSERT INTO placed_orders (group_id, user_id, available_order_id)
          VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const placedOrder = await pool.query(
      placedOrderQueryStr,
      [groupId, userid, availableOrderId]
    );
    const placedOrderId = placedOrder.rows[0].id;

    for (let item of itemsOrdered) {
      const { itemid, orderedQty, availableItemId } = item;

      // INSERT INTO ordered_items table
      const orderedItemsQueryStr = `
        INSERT INTO ordered_items (quantity, item_id, placed_order_id, available_item_id, available_order_id)
          VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      await pool.query(
        orderedItemsQueryStr,
        [orderedQty, itemid, placedOrderId, availableItemId, availableOrderId]
      );

      //TODO SET CONSTRAINT ON QUERY => if remaining_qty - $1 < 0 => ABORT
      // UPDATE available_items table
      const availableItemsQueryStr = `
        UPDATE available_items
          SET remaining_qty = remaining_qty - $1
        WHERE id = $2;
      `;
      await pool.query(
        availableItemsQueryStr,
        [orderedQty, availableItemId]
      );
    }

    await pool.query('COMMIT');

    return { ok: true, payload: placedOrderId };

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}
