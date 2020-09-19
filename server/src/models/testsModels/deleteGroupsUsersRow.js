'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteGroupsUsersRow (groupid, userid) {
  try {
    await pool.query(
      `DELETE FROM groupsusers WHERE group_id = $1 AND user_id = $2`,
      [groupid, userid]
    );
    return { ok: true, payload: true };

  } catch (error) {
    return handleErrorModel(error);
  }
};