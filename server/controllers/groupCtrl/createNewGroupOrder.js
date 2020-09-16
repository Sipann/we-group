'use strict';

import { DBCreateNewGroupOrder } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function createNewGroupOrder (ctx) {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const newAvailableOrder = ctx.request.body;
    const response = await DBCreateNewGroupOrder(userid, groupid, newAvailableOrder);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
};