'use strict';

import { DBFetchStaticManageGroupData } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function fetchStaticManageGroupData (ctx) {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const response = await DBFetchStaticManageGroupData(userid, groupid);
    if (response.ok) {
      ctx.status = 200;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
};