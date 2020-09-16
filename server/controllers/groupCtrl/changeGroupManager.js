'use strict';

import { DBChangeGroupManager } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';
import { DBIsUserGroupMember, DBIsUserGroupManager } from '../../models/utilsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function changeGroupManager (ctx) {
  try {
    const { userid } = ctx.request.header;  // current group manager userid
    const { groupid } = ctx.params;
    const { newManagerid } = ctx.request.body;

    const isCurrentUserManagerOfGroup = await DBIsUserGroupManager(userid, groupid);
    if (!isCurrentUserManagerOfGroup.ok || !isCurrentUserManagerOfGroup.payload) {
      throw new Error(errorMessages.notAllowed);
    }

    const isNewManagerMemberOfGroup = await DBIsUserGroupMember(newManagerid, groupid);
    if (!isNewManagerMemberOfGroup.ok || !isNewManagerMemberOfGroup.payload) {
      throw new Error(errorMessages.invalidInput);
    }

    const response = await DBChangeGroupManager(newManagerid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
};
