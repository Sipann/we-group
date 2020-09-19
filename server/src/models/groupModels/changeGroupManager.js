'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function changeGroupManager (newManagerid, groupid) {
  try {

    const queryStr = `
      UPDATE groups
        SET manager_id = $1
      WHERE id = $2
      RETURNING *;`;

    const response = await pool.query(queryStr, [newManagerid, groupid]);
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
