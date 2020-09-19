'use strict';

import { DBGetAvailableItemLastInserted } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';


export async function getAvailableItemLastInserted (ctx) {
  try {
    const response = await DBGetAvailableItemLastInserted();
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}