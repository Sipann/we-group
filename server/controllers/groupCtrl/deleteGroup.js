'use strict';

import { DBIsGroupDeletable, DBIsUserGroupManager } from '../../models/utilsModels';
import { DBDeleteGroup } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function deleteGroup (ctx) {
  try {
    const { userid } = ctx.request.header;
    const { groupid } = ctx.params;

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupid);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    const groupIsDeletable = await DBIsGroupDeletable(groupid);
    if (!groupIsDeletable.ok || !groupIsDeletable.payload) throw new Error(errorMessages.notAllowed);
    // console.log('CTRL GROUP IS DELETABLE response =>', groupIsDeletable);

    const response = await DBDeleteGroup(groupid);
    // console.log('CTRL response =>', response);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}
