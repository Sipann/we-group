'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchPlacedOrderItems (placedorderid) {
  try {
    if (!placedorderid) throw new Error(errorMessages.missingArguments);
    const queryStr = `SELECT * FROM ordered_items WHERE placed_order_id = $1;`;
    const response = await pool.query(queryStr, [placedorderid]);
    if (response.rows) return { ok: true, payload: response.rows }
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}