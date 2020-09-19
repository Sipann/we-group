'use strict';

import { Context } from 'koa';

import { DBSearchGroups } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function searchGroups(ctx: Context) {
  try {
    const { userid } = ctx.request.header;
    const response = await DBSearchGroups(userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}
