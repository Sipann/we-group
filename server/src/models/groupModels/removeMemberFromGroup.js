'use strict';

import pool from '../index';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function removeMemberFromGroup (removedUserid, groupid) {
  try {
    if (!removedUserid) throw new Error(errorMessages.notAllowed);
    const now = new Date();
    await pool.query(
      `UPDATE groupsusers
          SET has_left = $1
      WHERE user_id = $2 AND group_id = $3;`,
      [now, removedUserid, groupid]
    );

    return { ok: true, payload: true };

  } catch (error) {
    return handleErrorModel(error);
  }
}
