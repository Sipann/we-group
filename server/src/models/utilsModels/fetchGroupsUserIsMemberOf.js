'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';



export async function fetchGroupsUserIsMemberOf (userid) {
  try {

    if (!userid) throw new Error(errorMessages.notAllowed);


    const queryStr = `
      SELECT
        groups.id as id,
        groups.name as name,
        groups.description as description,
        groups.manager_id as manager_id
      FROM groups
      INNER JOIN groupsusers
        ON groups.id = groupsusers.group_id
        AND groupsusers.user_id = $1;
    `;

    const response = await pool.query(queryStr, [userid]);

    if (response.rows) return { ok: true, payload: response.rows };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}