'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function deleteUser (user) {
  try {

    await pool.query('BEGIN');

    await pool.query(
      `DELETE FROM groupsusers WHERE user_id = $1`,
      [user.id]
    );

    const username = `${user.name} (left)`;
    const userQueryStr = `
      UPDATE users
        SET name = $2, email = NULL
      WHERE id = $1;`;

    await pool.query(userQueryStr, [user.id, username]);
    await pool.query('COMMIT');

    return { ok: true, payload: true };

  } catch (error) {
    return handleErrorModel(error);
  }
}
