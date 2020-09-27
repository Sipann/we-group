'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchUserDataDetails (userid) {
  try {
    if (!userid) throw new Error(errorMessages.notAllowed);

    const queryStr = `SELECT * FROM users WHERE id = $1;`;
    const response = await pool.query(queryStr, [userid]);

    if (response.rows?.length) return { ok: true, payload: response.rows[0] }
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}