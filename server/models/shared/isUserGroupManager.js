import pool from './index';
import { errorMessages } from '../../utils/errorMessages';



export async function isUserGroupManager (userid, groupid) {
  try {
    const values = [groupid];
    const queryStr = `
      SELECT manager_id from GROUPS
      WHERE id = $1;
    `;
    const groupManagerId = await pool.query(queryStr, values);
    if (groupManagerId.rows.length && groupManagerId.rows[0].manager_id) {
      return { ok: true, payload: groupManagerId.rows[0].manager_id === userid };
    }
    else throw new Error(errorMessages.internalServerError);
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}
