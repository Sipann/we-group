'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';


export async function putGroupManagerId (groupid, managerid) {
  try {
    const response = await pool.query(
      `UPDATE groups
        SET manager_id = $2
      WHERE id = $1
      RETURNING *;`,
      [groupid, managerid]
    );
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else return { ok: true, payload: [] };
  } catch (error) {
    return handleErrorModel(error);
  }
}
