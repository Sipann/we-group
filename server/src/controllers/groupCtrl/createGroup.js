'use strict';

import { DBCreateGroup } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function createGroup (ctx) {
  try {
    const group = ctx.request.body;
    const { userid } = ctx.request.header;
    const response = await DBCreateGroup(group, userid);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}