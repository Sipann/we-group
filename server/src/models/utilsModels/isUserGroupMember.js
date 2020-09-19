'use strict';

import { DBGetLightGroupMembers } from './index';
import { handleErrorModel } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function isUserGroupMember (userid, groupid) {
  try {
    const response = await DBGetLightGroupMembers(groupid);
    if (response.ok) {
      if (response.payload.find(member => member.id === userid)) {
        return { ok: true, payload: true };
      }
      else {
        return { ok: true, payload: false };
      }
    }
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
}