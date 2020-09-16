'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function deletePlacedOrder (placedorderid, orderedItems) {
  try {

    await pool.query('BEGIN');

    // UPDATE AVAILABLE ITEMS TABLE
    for (let item of orderedItems) {
      const availableItemId = item.available_item_id;
      const cancelledQty = item.quantity;
      const putAvailableItemsStr = `
        UPDATE available_items
          SET remaining_qty = remaining_qty + $2
        WHERE id = $1;`;
      await pool.query(putAvailableItemsStr, [availableItemId, cancelledQty]);
    }

    // DELETE FROM ORDERED ITEMS TABLE
    const deleteOrderedItemStr = `DELETE FROM ordered_items WHERE placed_order_id = $1`;
    await pool.query(deleteOrderedItemStr, [placedorderid]);

    // DELETE FROM PLACED ORDERS TABLE
    const deletePlacedOrderStr = `DELETE FROM placed_orders WHERE id = $1`;
    await pool.query(deletePlacedOrderStr, [placedorderid]);

    await pool.query('COMMIT');

    return { ok: true, payload: placedorderid };

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}
