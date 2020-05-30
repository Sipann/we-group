'use strict';

const pool = require('../models');
const { isUserGroupManager } = require('./utils');



exports.fetchGroupOrders = async (userid, groupid) => {
  try {
    const userIsAllowed = await isUserGroupManager(userid, groupid);
    if (userIsAllowed) {
      const values = [groupid];
      const queryStr = `
        SELECT
          orders.id as order_id,
          orders.user_id as user_id,
          orders.group_id as group_id,
          orders.deadline_order_ts as order_deadline_ts,
          orders.delivery_ts as order_delivery_ts,
          orders.delivery_status as order_delivery_status,
          orders.confirmed_status as order_confirmed_status,
          groups.name as group_name,
          users.name as user_name,
          items.id as item_id,
          items.name as item_name,
          items.price as item_price,
          ordered_items.quantity as item_ordered_quantity

        FROM orders

        JOIN ordered_items
          ON ordered_items.order_id = orders.id
          AND orders.group_id = $1

        LEFT JOIN users
          ON orders.user_id = users.id

        LEFT JOIN groups
          ON orders.group_id = groups.id

        LEFT JOIN items
          ON ordered_items.item_id = items.id
      `;

      const response = await pool.query(queryStr, values);
      return { ok: true, payload: response.rows };
    }
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('test 1 error', error.message);
  }

};


exports.fetchGroupOrder = async (userid, groupid) => {
  try {
    if (isUserGroupManager(userid, groupid)) {
      // get group deadline
      const valuesDeadline = [groupid];
      const queryStrDeadline = `
        SELECT deadline FROM groups
          WHERE id = $1;
      `;
      const deadline = await pool.query(queryStrDeadline, valuesDeadline);

      const values = [groupid, deadline.rows[0].deadline];
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
        ON ordered_items.item_id = items.id;
      `;

      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows }
    }
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('[group model - fetchGroupOrders] error', error.message);
  }
};

exports.updateGroup = async (group, userid) => {
  try {
    if (isUserGroupManager(userid, group.id)) {
      const values = [group.id, group.name, group.description, group.deadline];
      const queryStr = `
        UPDATE groups
          SET name = $2, description = $3, deadline = $4
          WHERE id = $1
        RETURNING *;`;
      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows[0] };
    }
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('[group model - updateGroup] error', error.message);
  }
}


exports.getUserGroups = async (userid) => {
  try {
    const values = [userid];
    const queryStr = `
      SELECT
        groups.id as id,
        groups.name as name,
        groups.description as description,
        groups.manager_id as manager_id
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
      RETURNING *;`;
    const newGroup = await pool.query(queryGroupStr, valuesGroup);

    const groupid = +newGroup.rows[0].id;
    const valuesBridge = [groupid, manager_id];
    const queryBridgeStr = `
      INSERT INTO groupsusers (group_id, user_id)
      VALUES ($1, $2);`;
    await pool.query(queryBridgeStr, valuesBridge);

    return newGroup.rows[0];

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
};

exports.searchGroups = async userid => {
  console.log('[models - searchGroups] entering');
  try {
    const values = [userid];
    const queryStr = `
       SELECT
        groups.id as id,
        groups.name as name,
        groups.description as description,
        groups.manager_id as manager_id
      FROM groups;`;
    const res = await pool.query(queryStr);
    return res.rows;
  } catch (error) {
    console.log('[group model - updateGroupDeadline db] error', error.message);
  }
};

exports.addUserToGroup = async (userid, groupid) => {
  try {
    //TODO transaction
    const valuesAddMember = [userid, groupid];
    const queryStrAddMember = `
      INSERT INTO groupsusers (user_id, group_id)
        VALUES ($1, $2);`;
    await pool.query(queryStrAddMember, valuesAddMember);

    const valuesGroup = [groupid];
    const queryStrGroup = `
      SELECT * FROM groups
        WHERE id = $1;
    `;

    const res = await pool.query(queryStrGroup, valuesGroup);
    return { ok: true, payload: res.rows[0] };

  } catch (error) {
    console.log('[group model - addUserToGroup db] error', error.message);
  }
}
