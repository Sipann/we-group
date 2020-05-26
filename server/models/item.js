'use strict';

const pool = require('../models');
const { getGroupUsers } = require('./group');

exports.fetchGroupItems = async (groupid, userid) => {
  try {
    // check that user is a member of the group before returning list of all items
    const groupMembers = await getGroupUsers(groupid);
    if (groupMembers.rows.find(member => member.id === userid)) {
      const values = [groupid];
      const queryStr = `
      SELECT * FROM items
      WHERE group_id = $1;`;
      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows };
    }
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('[item model - fetchGroupItems db err]', error.message);
  }
};

const isUserGroupManager = async (userid, groupid) => {
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

const getGroupOfItem = async itemid => {
  try {
    const values = [itemid];
    const queryStr = `
      SELECT group_id FROM items
      WHERE id = $1;
    `;
    const res = await pool.query(queryStr, values);
    return res.rows[0].group_id;
  } catch (error) {
    console.log('[item model - getGroupOfItem]', error.message);
  }
};



exports.addItemToGroup = async (item, groupid, userid) => {
  try {
    if (isUserGroupManager(userid, groupid)) {
      const { name, description, price, currency, initial_qty } = item;
      const values = [name, description, price, currency, initial_qty, groupid];
      const queryStr = `
        INSERT INTO items (name, description, price, currency, initial_qty, remaining_qty, group_id)
        VALUES ($1, $2, $3, $4, $5, $5, $6)
        RETURNING *; `;
      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows[0] };
    }
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('[item model - addItemToGroup db err]', error.message);
  }
};


exports.deleteItemFromGroup = async (itemid, userid) => {
  try {

    // which group does this item belongs to
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
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('[item model - deleteItemFromGroup db error]', error.message);
  }
};



exports.deleteItem = async (itemid) => {
  try {
    const values = [itemid];
    const queryStr = `
      DELETE FROM items
        WHERE id = $1;`;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[item model - deleteItemFromGroup db err]', error.message);
  }
}
