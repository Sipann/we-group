'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function getLightGroupMembers (groupid) {
  try {
    if (!groupid) throw new Error(errorMessages.invalidInput);

    const queryStr = `
      SELECT
        users.id as id,
        users.name as name
      FROM users
      JOIN groupsusers
        ON users.id = groupsusers.user_id
        AND groupsusers.group_id = $1;`;

    const response = await pool.query(queryStr, [groupid]);
    if (response.rows) return { ok: true, payload: response.rows };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}