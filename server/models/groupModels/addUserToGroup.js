'use strict';

import pool from '../index';
import { DBIsGroupIdValid, DBIsUserGroupMember, DBIsUserIdValid } from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function addUserToGroup (userid, groupid) {
  try {
    if (!userid) throw new Error(errorMessages.notAllowed);

    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const groupIdIsValid = await DBIsGroupIdValid(groupid);
    if (!groupIdIsValid.ok || !groupIdIsValid.payload) throw new Error(errorMessages.missingArguments);

    const userIsGroupMember = await DBIsUserGroupMember(userid, groupid);
    if (userIsGroupMember.ok && userIsGroupMember.payload) throw new Error(errorMessages.unnecessary);

    await pool.query('BEGIN');

    const queryStrAddMember = `
      INSERT INTO groupsusers (user_id, group_id)
        VALUES ($1, $2);`;
    await pool.query(queryStrAddMember, [userid, groupid]);

    const queryStrGroup = `SELECT * FROM groups WHERE id = $1; `;
    const response = await pool.query(queryStrGroup, [groupid]);

    await pool.query('COMMIT');

    return { ok: true, payload: response.rows[0] };

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}
