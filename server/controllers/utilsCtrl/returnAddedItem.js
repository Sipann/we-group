'use strict';

import { DBReturnAddedItem } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function returnAddedItem (ctx) {
  try {
    const { itemid, availableorderid } = ctx.params;
    const response = await DBReturnAddedItem(itemid, availableorderid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}