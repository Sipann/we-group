'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';

export async function deleteUserById (userid) {
  try {
    await pool.query(
      `DELETE FROM users WHERE id = $1;`,
      [userid]
    );
    return { ok: true, payload: true };
  } catch (error) {
    return handleErrorModel(error);
  }
}