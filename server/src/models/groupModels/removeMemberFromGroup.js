'use strict';

import pool from '../index';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function removeMemberFromGroup (userid, groupid) {
  try {
    if (!userid) throw new Error(errorMessages.notAllowed);
    // TODO => make sure that other requests do not rely on users being group members to fetch previous orders for instance
    await pool.query(
      `DELETE FROM groupsusers WHERE user_id = $1 AND group_id = $2;`,
      [userid, groupid]
    );

    return { ok: true, payload: true };

  } catch (error) {
    return handleErrorModel(error);
  }
}
