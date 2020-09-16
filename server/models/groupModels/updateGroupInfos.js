'use strict';

import pool from '../index';
import { DBIsUserGroupManager, DBIsUserIdValid, DBIsGroupIdValid } from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function updateGroupInfos (group, userid) {
  try {

    if (!group || !group.id || !group.name || !group.description) throw new Error(errorMessages.missingArguments);
    if (!userid) throw new Error(errorMessages.notAllowed);

    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const groupIdIsValid = await DBIsGroupIdValid(group.id);
    if (!groupIdIsValid.ok || !groupIdIsValid.payload) throw new Error(errorMessages.missingArguments);

    const userIsGroupManager = await DBIsUserGroupManager(userid, group.id);

    if (userIsGroupManager.ok && userIsGroupManager.payload) {
      const values = [group.id, group.name, group.description];
      const queryStr = `
        UPDATE groups
          SET name = $2, description = $3
          WHERE id = $1
        RETURNING *;`;
      const response = await pool.query(queryStr, values);
      return { ok: true, payload: response.rows[0] };
    }
    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    return handleErrorModel(error);
  }
}
