const pool = require('../models');

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
    console.log('[item model - isUserGroupManager db err]', error.message);
  }
};