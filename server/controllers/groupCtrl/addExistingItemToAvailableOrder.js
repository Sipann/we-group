'use strict';

import { DBAddExistingItemToAvailableOrder } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function addExistingItemToAvailableOrder (ctx) {
  try {
    const { orderid } = ctx.params;
    const { userid } = ctx.request.header;
    const itemData = ctx.request.body;
    const response = await DBAddExistingItemToAvailableOrder(userid, orderid, itemData);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
};