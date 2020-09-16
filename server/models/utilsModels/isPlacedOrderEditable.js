'use strict';

import pool from '../index';
import { DBFetchPlacedOrder } from '../orderModels';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function isPlacedOrderEditable (placedorderid) {
  try {
    if (!placedorderid) throw new Error(errorMessages.invalidInput);

    const placedOrderResponse = await DBFetchPlacedOrder(placedorderid);
    if (!placedOrderResponse.ok) throw new Error(errorMessages.invalidInput);
    const placedOrder = placedOrderResponse.payload;
    if (!placedOrder.confirmed_status && (new Date(placedOrder.deadline_ts) > new Date())) {
      return { ok: true, payload: true };
    }
    else return { ok: true, payload: false };

  } catch (error) {
    return handleErrorModel(error);
  }
}