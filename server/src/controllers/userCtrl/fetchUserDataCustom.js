'use strict';

import { DBFetchUserDataCustom } from '../../models/userModels';
import { handleErrorCtrl } from '../utils';


export async function fetchUserDataCustom (ctx) {
  try {
    const { userid } = ctx.request.header;
    const response = await DBFetchUserDataCustom(userid);
    // console.log('FETCH USER DATA CUSTOMCTRL response.payload =>', response.payload);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}