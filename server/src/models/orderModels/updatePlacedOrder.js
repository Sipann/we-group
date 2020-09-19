'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function updatePlacedOrder (placedorderid, availableOrderId, orderedItems) {
  try {
    const deletedItems = 0;

    await pool.query('BEGIN');

    for (let item of orderedItems) {
      const { availableItemId, itemid, changedQty, initialOrderedQty } = item;

      // UPDATE AVAILABLE ITEMS TABLE
      const putAvailableItemsStr = `
        UPDATE available_items
          SET remaining_qty = remaining_qty - $2
        WHERE id = $1;`;
      await pool.query(putAvailableItemsStr, [availableItemId, changedQty]);


      if (!initialOrderedQty && changedQty > 0) {
        // INSERT NEW ORDERED ITEM INTO ORDERED ITEMS TABLE
        const orderedItemsQueryStr = `
          INSERT INTO ordered_items (quantity, item_id, placed_order_id, available_item_id, available_order_id)
            VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
      `;
        await pool.query(
          orderedItemsQueryStr,
          [changedQty, itemid, placedorderid, availableItemId, availableOrderId]
        );
      }

      else if (initialOrderedQty && changedQty > -initialOrderedQty) {
        // UPDATE ALREADY ORDERED ITEM ON ORDERED ITEMS TABLE
        const newQty = initialOrderedQty + changedQty;
        const orderedItemsQueryStr = `
          UPDATE ordered_items
            SET remaining_qty = $3
          WHERE placed_order_id = $1 AND available_item_id = $2;`;
        await pool.query(orderedItemsQueryStr, [placedorderid, availableItemId, newQty]);
      }

      else if (initialOrderedQty && changedQty === -initialOrderedQty) {
        // DELETE ALREADY ORDERED ITEM ON ORDERED ITEMS TABLES
        const orderedItemsQueryStr = `DELETE FROM ordered_items WHERE placed_order_id = $1 AND available_items = $2`;
        await pool.query(orderedItemsQueryStr, [placedorderid, availableItemId]);
        deletedItems++;
      }

      else throw new Error(errorMessages.invalidInput);

    }

    if (deletedItems === orderedItems.length) {
      // DELETE FROM PLACED ORDERS TABLE
      const deletePlacedOrderStr = `DELETE FROM placed_orders WHERE id = $1`;
      await pool.query(deletePlacedOrderStr, [placedorderid]);
    }

    await pool.query('COMMIT');

    return { ok: true, payload: placedorderid };

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}
