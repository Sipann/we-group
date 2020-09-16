import pool from './index';
import { errorMessages } from '../../utils/errorMessages';


export async function isUserIdValid (userid) {
  try {
    const response = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userid]
    );
    if (response.rows.length) { return { ok: true, payload: response.rows[0] } }
    else throw new Error(errorMessages.internalServerError);
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}