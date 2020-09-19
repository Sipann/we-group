import pool from './index';
import { errorMessages } from '../../utils/errorMessages';


export async function isGroupIdValid (groupid) {
  try {
    const response = await pool.query(
      `SELECT * FROM groups WHERE id = $1`,
      [groupid]
    );
    if (response.rows.length) { return { ok: true, payload: response.rows[0] } }
    else throw new Error(errorMessages.internalServerError);
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}