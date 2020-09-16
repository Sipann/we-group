'use strict';

import pool from '../index';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function returnAddedItem (addedToOrderItemId, orderid) {
  try {
    const queryStrAddedItem = `
      SELECT
          available_items.id as availableItemId,
          available_items.initial_qty as availableItemInitialQty,
          available_items.remaining_qty as availableItemRemainingQty,
          items.id as itemid,
          items.name as itemName,
          items.description as itemDescription,
          items.price as itemPrice
        FROM available_items
        JOIN items
          ON available_items.item_id = items.id
          AND available_items.id = $1
          AND available_items.available_order_id = $2;
      `;
    const addedItemResponse = await pool.query(queryStrAddedItem, [addedToOrderItemId, orderid]);
    if (addedItemResponse.rows?.length) return { ok: true, payload: addedItemResponse.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
