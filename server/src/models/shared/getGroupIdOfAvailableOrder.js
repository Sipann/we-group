import pool from './index';
import { errorMessages } from '../../utils/errorMessages';


export async function getGroupIdOfAvailableOrder (orderid) {
  try {
    const values = [orderid];
    const queryStr = `
      SELECT group_id FROM available_orders
      WHERE id = $1;
    `;
    const response = await pool.query(queryStr, values);
    if (response.rows.length) return { ok: true, payload: response.rows[0].group_id };
    else throw new Error(errorMessages.invalidInput);

  } catch (error) {
    return { ok: false, payload: error.message };
  }
}
