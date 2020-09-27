'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function isGroupActive (groupid) {
  try {
    if (!groupid) throw new Error(errorMessages.invalidInput);
    const response = await pool.query(
      ` SELECT manager_id FROM groups WHERE id = $1;`,
      [groupid]
    );

    if (response.rows?.length) {
      return { ok: true, payload: !!response.rows[0].manager_id };
    }
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}