'use strict';

import { DBReinsertUser } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function reinsertUser (ctx) {
  try {
    const userData = ctx.request.body;
    const response = await DBReinsertUser(userData);
    if (response.ok) ctx.body = { ok: true, payload: response.payload };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}