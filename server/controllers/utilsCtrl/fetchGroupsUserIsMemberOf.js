'use strict';

import { DBFetchGroupsUserIsMemberOf } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';


export async function fetchGroupsUserIsMemberOf (ctx) {
  try {
    const { userid } = ctx.request.headers;
    const response = await DBFetchGroupsUserIsMemberOf(userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}