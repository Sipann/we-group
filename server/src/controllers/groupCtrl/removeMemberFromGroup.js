'use strict';

import { DBRemoveMemberFromGroup } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';
import { DBIsUserGroupManager, DBIsUserRemovable } from '../../models/utilsModels';
import { errorMessages } from '../../utils/errorMessages';


export async function removeMemberFromGroup (ctx) {
  try {
    const { userid } = ctx.request.header;
    const { groupid } = ctx.params;
    const { removedUserid } = ctx.request.body;

    if (!userid) throw new Error(errorMessages.notAllowed);
    if (!removedUserid) throw new Error(errorMessages.missingArguments);

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupid);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    const userIsRemovable = await DBIsUserRemovable(removedUserid, groupid);
    if (!userIsRemovable.ok || !userIsRemovable.payload) throw new Error(errorMessages.notAllowed);

    const response = await DBRemoveMemberFromGroup(removedUserid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}
