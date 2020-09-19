import pool from './index';
import { errorMessages } from '../../utils/errorMessages';


export async function isAvailableOrderIdValid (orderid) {
  try {
    const response = await pool.query(
      `SELECT * FROM available_orders WHERE id = $1`,
      [orderid]
    );
    if (response.rows.length) { return { ok: true, payload: response.rows[0] } }
    else throw new Error(errorMessages.internalServerError);
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}
