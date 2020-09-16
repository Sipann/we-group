'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function createGroup (group, manager_id) {
  try {
    const { name, description, currency } = group;
    if (!name || !description || !currency) throw new Error(errorMessages.missingArguments);
    if (!manager_id) throw new Error(errorMessages.notAllowed);

    await pool.query('BEGIN');

    const groupsValues = [name, description, currency, manager_id];
    const groupsStr = `
      INSERT INTO groups (name, description, currency, manager_id)
        VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const newGroup = await pool.query(groupsStr, groupsValues);
    const insertedGroupId = newGroup.rows[0].id;
    const groupsusersValues = [insertedGroupId, manager_id];
    const groupsusersStr = `
      INSERT INTO groupsusers (group_id, user_id)
        VALUES ($1, $2)`;
    await pool.query(groupsusersStr, groupsusersValues);

    await pool.query('COMMIT');

    return { ok: true, payload: newGroup.rows[0] };

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}