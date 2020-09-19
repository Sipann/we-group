'use strict';

import { DBCreateUser } from '../../models/userModels';
import { handleErrorCtrl } from '../utils';

export async function createUser (ctx) {
  try {
    const user = ctx.request.body;
    const response = await DBCreateUser(user);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}