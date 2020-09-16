'use strict';

import pool from '../index';
import { DBIsUserGroupManager } from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchGroupMembers (userid, groupid) {
  try {
    if (!userid) throw new Error(errorMessages.notAllowed);

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupid);

    if (userIsGroupManager.ok && userIsGroupManager.payload) {
      const queryStr = `
        SELECT
          users.id as userid,
          users.name as username
        FROM users
        JOIN groupsusers ON users.id = groupsusers.user_id AND groupsusers.group_id = $1;`;
      const response = await pool.query(queryStr, [groupid]);

      if (response.rows?.length) return { ok: true, payload: response.rows };
      else throw new Error(errorMessages.internalServerError);
    }

    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    return handleErrorModel(error);
  }
}
