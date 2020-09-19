'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function doesAvailableOrderExist (availableorder) {
  try {
    const { groupid, deadlineTs, deliveryTs } = availableorder;
    const response = await pool.query(
      `SELECT * FROM available_orders WHERE group_id = $1 AND deadline_ts = $2 AND delivery_ts = $3 `,
      [groupid, deadlineTs, deliveryTs]);

    if (response.rows.length) return { ok: true, payload: true };
    else if (response.rows.length === 0) return { ok: true, payload: false };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}