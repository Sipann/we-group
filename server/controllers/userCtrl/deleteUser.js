'use strict';

import { DBDeleteUser } from '../../models/userModels';
import { DBGetUserById } from '../../models/testsModels';   //!move to utilsModels
import { DBIsUserDeletable } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';
import { errorMessages } from '../../utils/errorMessages';

export async function deleteUser (ctx) {
  try {
    const { userid } = ctx.request.header;

    const userIsDeletable = await DBIsUserDeletable(userid);
    if (!userIsDeletable.ok || !userIsDeletable.payload) throw new Error(errorMessages.notAllowed);

    const getUser = await DBGetUserById(userid);
    if (!getUser.ok || Array.isArray(getUser.payload)) throw new Error(errorMessages.invalidInput);
    const user = getUser.payload;

    // const response = await DBDeleteUser(user);
    // if (response.ok) ctx.body = { ...response };
    // else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}