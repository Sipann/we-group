'use strict';

import { DBFetchGroupFullAvailableOrders } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function fetchGroupFullAvailableOrders (ctx) {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.headers;
    const response = await DBFetchGroupFullAvailableOrders(userid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}