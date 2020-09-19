'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function getOrderedItemById (ordereditemid) {
  try {
    if (!ordereditemid) throw new Error(errorMessages.missingArguments);

    const response = await pool.query(
      `SELECT * FROM ordered_items WHERE id = $1;`,
      [ordereditemid]
    );

    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}