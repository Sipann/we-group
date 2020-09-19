'use strict';

import { DBGetUserById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getUserById (ctx) {
  try {
    const { userid } = ctx.params;
    const response = await DBGetUserById(userid);
    if (response.ok) ctx.body = { ok: true, payload: response.payload };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}