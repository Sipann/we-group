'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function getOrderedItem (placedorderid, itemid) {
  try {
    const response = await pool.query(
      `SELECT * FROM ordered_items WHERE placed_order_id = $1 AND item_id =$2;`,
      [placedorderid, itemid]
    );

    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}