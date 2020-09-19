'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchPlacedOrdersByAvailableOrder (availableOrderId) {
  try {

    const queryStr = `
      SELECT * FROM placed_orders
        WHERE available_order_id = $1;
    `;
    const response = await pool.query(queryStr, [availableOrderId]);
    if (response.rows) return { ok: true, payload: response.rows };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}