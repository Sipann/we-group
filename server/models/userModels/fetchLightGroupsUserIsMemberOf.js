'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchLightGroupsUserIsMemberOf (userid) {
  try {
    if (!userid) throw new Error(errorMessages.missingArguments);

    const queryStr = `
      SELECT
        groups.id as id,
        groups.name as name,
        groups.description as description,
        groups.manager_id as manager_id
      FROM groups
      INNER JOIN groupsusers ON groups.id = groupsusers.group_id AND groupsusers.user_id = $1;`;

    const response = await pool.query(queryStr, [userid]);
    return { ok: true, payload: response.rows };

  } catch (error) {
    return handleErrorModel(error);
  }
}