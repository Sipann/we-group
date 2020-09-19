'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function updateAvailableOrderInfos (availableOrderId, confirmed, delivered) {
  try {
    const queryStr = `
      UPDATE available_orders
        SET confirmed_status = $2, delivery_status = $3
      WHERE id = $1
      RETURNING *;
    `;

    const response = await pool.query(queryStr, [availableOrderId, confirmed, delivered]);
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
