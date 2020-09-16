'use strict';

import pool from '../index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function deleteGroup (groupid) {
  try {
    const queryStr = `
      UPDATE groups
        SET manager_id = NULL
      WHERE id = $1
      RETURNING *;`

    const response = await pool.query(queryStr, [groupid]);
    // console.log('MODELS response.rows =>', response.rows);
    if (response.rows?.length) return { ok: true, payload: groupid };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}
