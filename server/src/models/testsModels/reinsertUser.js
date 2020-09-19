'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function reinsertUser (userData) {
  try {

    const { user, groups } = userData;

    await pool.query('BEGIN');

    for (let group of groups) {
      console.log('REINSERT USER group =>', group);
      const queryStr = `
        INSERT INTO groupsusers
          (group_id, userid)
        VALUES ($1, $2);`;
      await pool.query(queryStr, [group.id, user.id]);
    }

    const queryStr = `
      UPDATE users
        SET name = $2, email = $3
      WHERE id = $1
      RETURNING *;`;

    const response = await pool.query(queryStr, [user.id, user.name, user.email]);

    await pool.query('COMMIT');

    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}