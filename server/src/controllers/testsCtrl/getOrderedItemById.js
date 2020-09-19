'use strict';

import { DBGetOrderedItemById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getOrderedItemById (ctx) {
  try {
    const { ordereditemid } = ctx.params;
    const response = await DBGetOrderedItemById(ordereditemid);

    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}