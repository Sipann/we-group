'use strict';

import pool from '../index';
import { DBGetGroupIdOfAvailableOrder, DBIsUserGroupManager, DBIsUserIdValid, DBIsAvailableOrderIdValid } from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';



export async function addNewItemToAvailableOrder (userid, orderid, item) {
  try {

    if (!userid) throw new Error(errorMessages.notAllowed);
    if (!item) throw new Error(errorMessages.missingArguments);

    const { itemName, itemDescription } = item;
    if (!itemName || !itemDescription) throw new Error(errorMessages.missingArguments);

    const itemPrice = item.itemPrice ? item.itemPrice : 0;
    const itemInitialQty = item.itemInitialQty ? item.itemInitialQty : 0;

    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok) throw new Error(errorMessages.notAllowed);

    const availableOrderIdIsValid = await DBIsAvailableOrderIdValid(orderid);
    if (!availableOrderIdIsValid.ok) throw new Error(errorMessages.missingArguments);

    const groupIdOfAvailableOrder = await DBGetGroupIdOfAvailableOrder(orderid);
    if (!groupIdOfAvailableOrder.ok) throw new Error(errorMessages.invalidInput);

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupIdOfAvailableOrder.payload);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    await pool.query('BEGIN');

    const queryStrItems = `
      INSERT INTO items (name, description, price, group_id)
        VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const itemsResponse = await pool.query(
      queryStrItems,
      [itemName, itemDescription, itemPrice, groupIdOfAvailableOrder.payload]
    );
    const itemid = itemsResponse.rows[0].id;

    const queryStrAvailableItems = `
      INSERT INTO available_items (item_id, initial_qty, remaining_qty, available_order_id)
        VALUES ($1, $2, $2, $3)
      RETURNING *;
      `;
    const availableItemsResponse = await pool.query(
      queryStrAvailableItems,
      [itemid, itemInitialQty, orderid]
    );
    const availableItemId = availableItemsResponse.rows[0].id;

    // sent back
    const valuesAddedItem = [availableItemId, orderid];
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
    const addedItemResponse = await pool.query(queryStrAddedItem, valuesAddedItem);

    await pool.query('COMMIT');

    return { ok: true, payload: addedItemResponse.rows[0] }


  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}
