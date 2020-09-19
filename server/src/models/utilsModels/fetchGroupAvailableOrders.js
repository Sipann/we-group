'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchGroupAvailableOrders (groupid) {
  try {

    const now = new Date();
    const queryStr = `
      SELECT * FROM available_orders
        WHERE group_id = $1 AND delivery_ts > $2;
    `;
    const response = await pool.query(queryStr, [groupid, now]);
    if (response.rows) return { ok: true, payload: response.rows };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}