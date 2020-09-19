import { getGroupMembers } from './getGroupMembers';


export async function isUserGroupMember (userid, groupid) {
  try {
    const groupMembers = await getGroupMembers(groupid);
    if (groupMembers.find(member => member.id === userid)) {
      return { ok: true, payload: true };
    }
    else {
      return { ok: true, payload: false };
    }
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}