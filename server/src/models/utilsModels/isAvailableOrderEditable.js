'use strict';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';



export async function isAvailableOrderEditable (availableOrder) {
  try {
    if (!availableOrder.confirmed && availableOrder.delivery_status !== 'done') return { ok: true, payload: true };
    else return { ok: true, payload: false };

  } catch (error) {
    return handleErrorModel(error);
  }
}