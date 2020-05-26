const pool = require('../models');
const { getGroupUsers } = require('./user');

exports.isUserGroupManager = async (userid, groupid) => {
  try {
    const values = [groupid];
    const queryStr = `
      SELECT manager_id from GROUPS
      WHERE id = $1;
    `;
    const groupManagerId = await pool.query(queryStr, values);
    return groupManagerId.rows[0].manager_id === userid;
  } catch (error) {
    console.log('[UTILS - isUserGroupManager db err]', error.message);
  }
};


exports.isUserGroupMember = async (userid, groupid) => {
  try {
    const groupMembers = await getGroupUsers(groupid);
    if (groupMembers.rows.find(member => member.id === userid)) {
      return { ok: true, payload: true };
    }
    else {
      return { ok: false, payload: false };
    }
  } catch (error) {
    console.log('[UTILS - isUserGroupMember db] err', error.message);
  }
};
