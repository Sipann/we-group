import pool from './index';
import { errorMessages } from '../../utils/errorMessages';

export async function getGroupMembers (groupid) {
  try {
    const values = [groupid];
    const queryStr = `
      SELECT
        users.id as id,
        users.name as name
      FROM users
      JOIN groupsusers ON users.id = groupsusers.user_id and groupsusers.group_id = $1;`;
    const response = await pool.query(queryStr, values);
    if (response.rows.length) return { ok: true, payload: response.rows };
    else throw new Error(errorMessages.internalServerError);
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}