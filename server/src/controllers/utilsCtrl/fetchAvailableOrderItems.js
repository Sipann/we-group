'use strict';

import { DBFetchAvailableOrderItems } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';


export async function fetchAvailableOrderItems (ctx) {
  try {
    const { availableorderid } = ctx.params;
    const response = await DBFetchAvailableOrderItems(availableorderid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}