'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteGroupById (groupid) {
  try {
    await pool.query('BEGIN');

    await pool.query(
      `DELETE FROM groupsusers WHERE group_id = $1;`,
      [groupid]
    );

    await pool.query(
      `DELETE FROM groups WHERE id = $1;`,
      [groupid]
    );

    await pool.query('COMMIT');
    return { ok: true, payload: true };

  } catch (error) {
    await pool.query('ROLLBACK');
    return handleErrorModel(error);
  }
}