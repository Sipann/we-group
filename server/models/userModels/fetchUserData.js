'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import {
} from './index';


export async function fetchUserData (userid) {
  try {

    const response = await pool.query(
      `SELECT * FROM users WHERE id = $1;`,
      [userid]
    );
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
