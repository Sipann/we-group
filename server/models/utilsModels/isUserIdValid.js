'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function isUserIdValid (userid) {
  try {
    if (!userid) throw new Error(errorMessages.invalidInput);

    const response = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userid]
    );
    if (response.rows?.length) return { ok: true, payload: true };
    else if (response.rows?.length === 0) return { ok: true, payload: false };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}