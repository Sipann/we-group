'use strict';

const pool = require('../models');

exports.deleteGroup = async groupname => {
  try {

    await pool.query('BEGIN');

    const groupValues = [groupname];
    const groupStr = `SELECT id FROM groups WHERE name = $1;`;
    const deletedGroup = await pool.query(groupStr, groupValues);
    const deletedGroupId = deletedGroup.rows[0].id;

    const groupsUsersStr = `DELETE FROM groupsusers WHERE group_id = $1;`
    await pool.query(groupsUsersStr, [deletedGroupId]);

    const groupsStr = `DELETE FROM groups WHERE id = $1`;
    await pool.query(groupsStr, [deletedGroupId]);

    await pool.query('COMMIT');

  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};


exports.deleteUser = async userid => {
  try {
    await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [userid]
    );
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};


exports.getGroupByName = async groupname => {
  try {
    const response = await pool.query(
      `SELECT * FROM groups WHERE name = $1`,
      [groupname]
    );
    // console.log('TESTS getGroupId response', response.rows[0]);
    return { ok: true, payload: response.rows[0] };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.getLastGroupsUsersAdded = async () => {
  try {
    const response = await pool.query('SELECT * FROM groupsusers ORDER BY id DESC LIMIT 1;');
    return { ok: true, payload: response.rows[0] };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.deleteGroupsUsersRow = async groupsusersid => {
  try {
    await pool.query(
      `DELETE FROM groupsusers WHERE id = $1`,
      [groupsusersid]
    );
    return { ok: true, payload: groupsusersid };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.getLastAvailableOrderAdded = async () => {
  try {
    const response = await pool.query('SELECT * FROM available_orders ORDER BY id DESC LIMIT 1;');
    // console.log('TESTS MODEL => response', response.rows[0]);
    return { ok: true, payload: response.rows[0] };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.deleteAvailableOrderRow = async availableorderid => {
  try {
    await pool.query(
      `DELETE FROM available_orders WHERE id = $1`,
      [availableorderid]
    );
    return { ok: true, payload: availableorderid };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.getFirstAvailableOrder = async () => {
  try {
    const response = await pool.query('SELECT * FROM available_orders ORDER BY id LIMIT 1;');
    return { ok: true, payload: response.rows[0] };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.lastInsertedItem = async () => {
  try {
    const response = await pool.query('SELECT * FROM items ORDER BY id DESC LIMIT 1;');
    return { ok: true, payload: response.rows[0] };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.lastInsertedAvailableItem = async () => {
  try {
    const response = await pool.query('SELECT * FROM available_items ORDER BY id DESC LIMIT 1;');
    return { ok: true, payload: response.rows[0] };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.deleteItemRow = async itemid => {
  try {
    await pool.query(
      `DELETE FROM items WHERE id = $1`,
      [itemid]
    );
    return { ok: true, payload: itemid };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.deleteAvailableItemRow = async availableitemid => {
  try {
    await pool.query(
      `DELETE FROM available_items WHERE id = $1`,
      [availableitemid]
    );
    return { ok: true, payload: availableitemid };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.getGroupAvailableOrders = async groupid => {
  try {
    const response = await pool.query(
      `SELECT * FROM available_orders WHERE group_id = $1;`,
      [groupid]
    );
    return { ok: true, payload: response.rows };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};

exports.getGroupItems = async groupid => {
  try {
    const response = await pool.query(
      `SELECT * FROM items WHERE group_id = $1;`,
      [groupid]
    );
    return { ok: true, payload: response.rows };
  } catch (error) {
    console.log('[TESTS MODEL] - error', error.message);
  }
};


// exports.deleteGroups = async () => {
//   try {

//     await pool.query('BEGIN');
//     await pool.query('DELETE FROM groupsusers');
//     await pool.query('DELETE FROM groups');
//     await pool.query('COMMIT');
//   } catch (error) {
//     console.log('[TESTS MODEL] - error', error.message);
//   }
// };