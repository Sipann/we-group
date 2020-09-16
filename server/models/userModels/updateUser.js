'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import { DBIsUserDataOwner } from '../utilsModels';


export async function updateUser (userid, user) {
  try {
    const userUpdatesOwnData = await DBIsUserDataOwner(userid, user);

    if (userUpdatesOwnData.ok && userUpdatesOwnData.payload) {

      const { name, email, phone, preferred_contact_mode } = user;

      if (!name || !email || !preferred_contact_mode) throw new Error(errorMessages.missingArguments);
      if (preferred_contact_mode === 'phone' && !phone) throw new Error(errorMessages.missingArguments);

      const queryStr = `
        UPDATE users
          SET name = $1, email = $2, phone = $3, preferred_contact_mode = $4
        WHERE id = $5
        RETURNING *`;

      const response = await pool.query(
        queryStr,
        [name, email, phone, preferred_contact_mode, userid]
      );
      if (response.rows?.length) return { ok: true, payload: response.rows[0] };
      else throw new Error(errorMessages.internalServerError);
    }

    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    return handleErrorModel(error);
  }
}