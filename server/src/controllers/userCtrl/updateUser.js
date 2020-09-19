'use strict';

import { DBUpdateUser } from '../../models/userModels';
import { handleErrorCtrl } from '../utils';

export async function updateUser (ctx) {
  try {

    const { userid } = ctx.request.header;
    const user = ctx.request.body;
    const response = await DBUpdateUser(userid, user);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}