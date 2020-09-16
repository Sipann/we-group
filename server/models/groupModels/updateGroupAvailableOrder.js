'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function updateGroupAvailableOrder (availableOrderId, items) {
  try {

    const queryStr = `

    `;

    // const response = await pool.query(queryStr, [availableOrderId, confirmed, delivered]);
    // if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    // else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
