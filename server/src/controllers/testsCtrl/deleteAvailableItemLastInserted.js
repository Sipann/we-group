'use strict';

import { DBDeleteAvailableItemLastInserted } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';


export async function deleteAvailableItemLastInserted (ctx) {
  try {
    // console.log('ENTERING CTRL DELETE LAST AVAILABLE ITEM INSERTED');

    await DBDeleteAvailableItemLastInserted();
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}