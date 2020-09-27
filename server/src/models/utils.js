import pool from '../models';
import { errorMessages } from '../utils/errorMessages';

export async function handleErrorModel (error) {
  return { ok: false, payload: error.message };
}
