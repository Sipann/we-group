'use strict';

const pool = require('../models');
const {
  getGroupUsers,
} = require('./group');

const {
  getGroupOfItem,
  isUserGroupManager,
  notAllowed,
} = require('./utils');


//TODO FOUND BUT NOT 100% SURE IT IS USED IN THE END
exports.deleteItemFromGroup = async (itemid, userid) => {
  try {
    const groupid = await getGroupOfItem(itemid);

    if (isUserGroupManager(userid, groupid)) {
      const values = [itemid];
      const queryStr = `
        UPDATE items
          SET initial_qty = 0
          WHERE id = $1
        RETURNING id;
      `;
      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows[0].id };
    }

    else return notAllowed();

  } catch (error) {
    console.log('[item model - deleteItemFromGroup db error]', error.message);
  }
};


exports.fetchGroupItems = async (groupid, userid) => {
  try {
    const groupMembers = await getGroupUsers(groupid);
    // const groupMembers = await getGroupMembers(groupid);

    if (groupMembers.rows.find(member => member.id === userid)) {
      const values = [groupid];
      const queryStr = `
      SELECT * FROM items
      WHERE group_id = $1;`;
      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows };
    }

    else return notAllowed();

  } catch (error) {
    console.log('[item model - fetchGroupItems db err]', error.message);
  }
};
