'use strict';

import { DBGetAvailableOrderById } from '../../models/testsModels';  //! move to utilsModels
import { DBIsAvailableOrderEditable } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isAvailableOrderEditable (ctx) {
  try {
    const { availableorderid } = ctx.params;
    if (!availableorderid) throw new Error(errorMessages.invalidInput);

    const availableOrderResponse = await DBGetAvailableOrderById(availableorderid);
    if (!availableOrderResponse.ok) throw new Error(errorMessages.invalidInput);
    const availableOrder = availableOrderResponse.payload;

    const response = await DBIsAvailableOrderEditable(availableOrder);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}