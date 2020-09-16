'use strict';

import { DBGetOrderedItem } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getOrderedItem (ctx) {
  try {
    const { placedorderid, itemid } = ctx.params;
    const response = await DBGetOrderedItem(placedorderid, itemid);

    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}