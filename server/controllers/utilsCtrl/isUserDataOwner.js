'use strict';

import { DBIsUserDataOwner } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';


export async function isUserDataOwner (ctx) {
  try {
    const { userid } = ctx.params;
    const user = ctx.request.body;
    const response = await DBIsUserDataOwner(userid, user);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}