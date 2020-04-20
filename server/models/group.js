'use strict';

const pool = require('../models');

exports.getUserGroups = async (userid) => {
  try {
    const values = [userid];
    const queryStr = `
      SELECT
        groups.id as id,
        groups.name as name,
        groups.description as description
      FROM groups
      INNER JOIN groupsusers ON groups.id = groupsusers.group_id AND groupsusers.user_id = $1;
    `;
    const res = await pool.query(queryStr, values);
    return res.rows;
  } catch (error) {
    console.log('[group model - getUserGroups db err]', error.message);
  }
};

exports.getGroupUsers = async (groupid) => {
  try {
    const values = [groupid];
    const queryStr = `
      SELECT
        users.id as id,
        users.name as name
      FROM users
      JOIN groupsusers ON users.id = groupsusers.user_id and groupsusers.group_id = $1;`;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[group model - getGroupUsers db] error', error.message);
  }
};



exports.getGroup = async (groupid) => {
  try {
    const values = [groupid];
    const queryStr = `SELECT * FROM groups WHERE id = $1;`;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[group model - getGroup] error', error.message)
  }
};



exports.createGroup = async (group, manager_id) => {
  try {
    const { name, description, currency } = group;
    const valuesGroup = [name, description, currency, manager_id];
    const queryGroupStr = `
      INSERT INTO groups (name, description, currency, manager_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id;`;
    const newGroup = await pool.query(queryGroupStr, valuesGroup);

    const groupid = +newGroup.rows[0].id;
    const valuesBridge = [groupid, manager_id];
    const queryBridgeStr = `
      INSERT INTO groupsusers (group_id, user_id)
      VALUES ($1, $2);`;
    await pool.query(queryBridgeStr, valuesBridge);

  } catch (error) {
    console.log('[group model - createGroup db err]', error.message);
  }
};
exports.getGroupOrder = async (groupid, deadline) => {
  try {
    const values = [groupid, deadline];
    const queryStr = `
      SELECT
        users.name as userName,
        items.name as itemName,
        ordered_items.quantity as orderedQuantity

      FROM orders

      JOIN ordered_items
        ON ordered_items.order_id = orders.id
        AND orders.group_id = $1 AND orders.date = $2

      LEFT JOIN users
        ON orders.user_id = users.id

      LEFT JOIN items
        ON ordered_items.item_id = items.id
    ;`;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[group model - getGroupOrder] error', error.message)
  }
};

exports.getGroupManageInfos = async (groupid) => {
  try {
    const values = [groupid];
    const queryStr = `
    SELECT * FROM items
      WHERE group_id = $1;
    `;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[group model - getGroupManageInfos db] error', error.message);
  }

};

exports.getGroupItems = async (groupid) => {
  try {
    const values = [groupid];
    const queryStr = `
      SELECT * FROM items
      WHERE group_id = $1;`;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[group model - getGroupItems db] error', error.message);
  }
};

exports.deleteGroup = async (groupid) => {
  try {
    const values = [groupid];
    const queryStrGroups = `
      DELETE FROM groups
      WHERE id = $1;`;
  } catch (error) {
    console.log('[group model - deleteGroup db] error', error.message);
  }
};

exports.updateGroupInfos = async (data, groupid) => {
  try {
    const { name, description } = data;
    const values = [name, description, groupid];
    const queryStr = `
      UPDATE groups
        SET name = $1, description = $2
        WHERE id = $3
      RETURNING *;`;
    const res = await pool.query(queryStr, values);
    return res.rows[0];
  } catch (error) {
    console.log('[group model - updateGroupInfos db] error', error.message);

  }
};

exports.updateGroupDeadline = async (deadline, groupid) => {
  try {
    const values = [deadline, groupid];
    const queryStr = `
      UPDATE groups
        SET deadline = $1
        WHERE id = $2
      RETURNING *;`;
    const res = await pool.query(queryStr, values);
    return res.rows[0];
  } catch (error) {
    console.log('[group model - updateGroupDeadline db] error', error.message);
  }
}