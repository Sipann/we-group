'use strict';

import { DBDoesAvailableOrderExist } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function doesAvailableOrderExist (ctx) {
  try {
    const availableorder = ctx.request.body;
    const response = await DBDoesAvailableOrderExist(availableorder);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}