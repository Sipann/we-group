'use strict';

import pool from '../index';
import { DBFetchPlacedOrdersByAvailableOrder } from '../utilsModels';
import { handleErrorModel } from '../utils';


export async function deleteGroupAvailableOrder (availableOrderId) {
  try {
    let placedOrders = [];

    await pool.query('BEGIN');

    const placedOrdersResponse = await DBFetchPlacedOrdersByAvailableOrder(availableOrderId);
    if (placedOrdersResponse.payload) placedOrders = placedOrdersResponse.payload;
    console.log('MODELS => placedOrders =>', placedOrders);

    for (let placedOrder of placedOrders) {
      // IF PLACED ORDERS => DELETE ORDERED ITEMS AND PLACED ORDERS
      const deleteOrderedItemsQueryStr = `DELETE FROM ordered_items WHERE placed_order_id = $1;`;
      await pool.query(deleteOrderedItemsQueryStr, [placedOrder.id]);

      const deletePlacedOrderQueryStr = `DELETE FROM placed_orders WHERE id = $1;`;
      await pool.query(deletePlacedOrderQueryStr, [placedOrder.id]);
    }

    // IF AVAILABLE ITEMS => DELETE THEM
    const deleteAvailableItemsQueryStr = `DELETE FROM available_items WHERE available_order_id = $1;`;
    await pool.query(deleteAvailableItemsQueryStr, [availableOrderId]);

    // DELETE AVAILABLE ORDER
    const deleteAvailableOrderQueryStr = `DELETE FROM available_orders WHERE id = $1`;
    await pool.query(deleteAvailableOrderQueryStr, [availableOrderId]);

    await pool.query('COMMIT');

    return { ok: true, payload: availableOrderId };

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}