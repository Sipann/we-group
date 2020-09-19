'use strict';

import { DBUpdateGroupInfos } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function updateGroupInfos (ctx) {
  try {
    const group = ctx.request.body;
    const { userid } = ctx.request.header;
    const response = await DBUpdateGroupInfos(group, userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}
