'use strict';

import pool from '../index';
import {
  DBAreAddAvailableItemArgsValid,
  DBReturnAddedItem,
} from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function addExistingItemToAvailableOrder (userid, orderid, itemData) {
  try {

    if (!userid) throw new Error(errorMessages.notAllowed);
    if (!itemData || !Object.keys(itemData).length) throw new Error(errorMessages.missingArguments);

    const { itemid, initialQty } = itemData;
    if (!itemid || !initialQty) throw new Error(errorMessages.missingArguments);

    const addAvailableItemsArgsAreValid = await DBAreAddAvailableItemArgsValid(userid, orderid);

    if (!addAvailableItemsArgsAreValid.ok) throw new Error(errorMessages.internalServerError);
    if (addAvailableItemsArgsAreValid.payload === errorMessages.notAllowed) throw new Error(errorMessages.notAllowed);
    if (addAvailableItemsArgsAreValid.payload === errorMessages.missingArguments) throw new Error(errorMessages.missingArguments);
    if (addAvailableItemsArgsAreValid.payload === errorMessages.invalidInput) throw new Error(errorMessages.invalidInput);

    await pool.query('BEGIN');

    const valuesItems = [itemid, initialQty, orderid];
    const queryStrItems = `
      INSERT INTO available_items (item_id, initial_qty, remaining_qty, available_order_id)
        VALUES ($1, $2, $2, $3)
      RETURNING *;
    `;
    const itemsResponse = await pool.query(queryStrItems, valuesItems);
    const addedToOrderItemId = itemsResponse.rows[0].id;

    const addedItemResponse = await DBReturnAddedItem(addedToOrderItemId, orderid);

    await pool.query('COMMIT');

    if (addedItemResponse.ok) return { ...addedItemResponse };
    else throw new Error(addedItemResponse.payload);

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}
