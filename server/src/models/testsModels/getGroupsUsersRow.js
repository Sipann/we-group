'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';

export async function getGroupsUsersRow (groupid, userid) {
  try {
    const response = await pool.query(
      `SELECT * FROM groupsusers WHERE group_id = $1 AND user_id = $2`,
      [groupid, userid]
    );
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
};