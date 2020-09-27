'use strict';

import { DBFetchUserDataDetails } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';


export async function fetchUserDataDetails (ctx) {
  try {
    const { userid } = ctx.params;
    const response = await DBFetchUserDataDetails(userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}