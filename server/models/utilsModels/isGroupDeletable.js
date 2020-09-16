'use strict';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import pool from '..';



export async function isGroupDeletable (groupid) {
  try {
    const now = new Date();
    const queryStr = `
      SELECT * FROM available_orders
        WHERE group_id = $1
        AND delivery_ts > $2;`

    const response = await pool.query(queryStr, [groupid, now]);

    if (response.rows?.length) return { ok: true, payload: false };
    else if (response.rows) return { ok: true, payload: true };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}