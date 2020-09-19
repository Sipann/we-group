'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function getGroupByName (groupname) {
  try {
    if (!groupname) throw new Error(errorMessages.invalidInput);

    const queryStr = `SELECT * FROM groups WHERE name = $1;`;

    const response = await pool.query(queryStr, [groupname]);
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}