import pool from './index';


export async function doesOrderExist (groupid, deliveryTs, deadlineTs) {
  try {
    const response = await pool.query(
      `SELECT * FROM available_orders WHERE group_id = $1 AND delivery_ts = $2 AND deadline_ts = $3`,
      [groupid, deliveryTs, deadlineTs]);
    if (response.rows.length) return { ok: true, payload: response.rows };
    else return { ok: false, payload: [] };
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}