'use strict';

import pool from '../index';
import { DBIsUserIdValid } from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function searchGroups (userid) {
  try {
    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const searchGroupsQueryStr = `
      SELECT
        groups.id as group_id,
        groups.name as group_name,
        groups.description as group_description,
        groups.currency as group_currency,
        groups.manager_id as group_manager_id
      FROM groups
        WHERE groups.id IN (
          SELECT group_id FROM groupsusers
            WHERE group_id NOT IN (
              SELECT group_id FROM groupsusers WHERE user_id = $1
            )
        )`;

    const searchGroups = await pool.query(searchGroupsQueryStr, [userid]);
    if (searchGroups.rows?.length) return { ok: true, payload: searchGroups.rows };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
