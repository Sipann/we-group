'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function getGroupIdOfAvailableOrder (availableorderid) {
  try {
    // console.log('UTILS MODELS availableorderid =>', availableorderid);
    const queryStr = `
      SELECT group_id FROM available_orders
        WHERE id = $1;
    `;
    const response = await pool.query(queryStr, [availableorderid]);
    if (response.rows?.length) return { ok: true, payload: response.rows[0].group_id };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}