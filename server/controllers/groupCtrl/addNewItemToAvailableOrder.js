'use strict';

import { DBAddNewItemToAvailableOrder } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';

export async function addNewItemToAvailableOrder (ctx) {
  try {
    const { orderid } = ctx.params;
    const { userid } = ctx.request.header;
    const item = ctx.request.body;
    const response = await DBAddNewItemToAvailableOrder(userid, orderid, item);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
};