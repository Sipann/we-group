'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function createUser (user) {
  try {
    const { id, name, email } = user;
    if (!id || !name || !email) throw new Error(errorMessages.missingArguments);

    const queryStr = `
      INSERT INTO users (id, name, email, preferred_contact_mode)
        VALUES ($1, $2, $3, $4)
      RETURNING *;`;
    const response = await pool.query(
      queryStr,
      [id, name, email, 'email']
    );
    return { ok: true, payload: response.rows[0] };

  } catch (error) {
    return handleErrorModel(error);
  }
}
