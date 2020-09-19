'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function getGroupById (groupid) {
  try {
    if (!groupid) throw new Error(errorMessages.missingArguments);

    const response = await pool.query(
      `SELECT * FROM groups WHERE id = $1;`,
      [groupid]
    );

    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}