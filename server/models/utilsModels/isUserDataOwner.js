'use strict';

import { handleErrorModel } from '../utils';


export async function isUserDataOwner (userid, user) {
  try {
    const { id: updatedUserid } = user;
    return {
      ok: true,
      payload: updatedUserid === userid,
    }
  } catch (error) {
    return handleErrorModel(error);
  }
}