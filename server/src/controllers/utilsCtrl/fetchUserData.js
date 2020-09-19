'use strict';

import { DBFetchUserData } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';


export async function fetchUserData (ctx) {
  try {
    const { userid } = ctx.params;
    const response = await DBFetchUserData(userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}