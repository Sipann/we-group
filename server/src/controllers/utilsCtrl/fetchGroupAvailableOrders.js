'use strict';

import { DBFetchGroupAvailableOrders } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';


export async function fetchGroupAvailableOrders (ctx) {
  try {
    const { groupid } = ctx.params;
    const response = await DBFetchGroupAvailableOrders(groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}