'use strict';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import pool from '..';
import Mockdate from 'mockdate';
import { test } from '../../config';


export async function isGroupDeletable (groupid) {
  try {

    if (process.env.NODE_ENV === 'test') {
      Mockdate.set(test.TEST_MOCK_DATE);
    }
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
  } finally {
    Mockdate.reset();
  }
}