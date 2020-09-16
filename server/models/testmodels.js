'use strict';

const pool = require('.');
const { isUserGroupManager } = require('./utils');

exports.fetchGroupOrders = async (userid, groupid) => {
  // console.log('ENTERING testFetchOrders with userid', userid, 'groupid', groupid);
  try {
    const userIsAllowed = await isUserGroupManager(userid, groupid);
    // console.log('userIsAllowed', userIsAllowed);
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
      // console.log('response', response);
      return { ok: true, payload: response.rows };

    }
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('test 1 error', error.message);
  }

};


exports.fetchUserOrders = async userid => {
  try {
    const values = [userid];
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
          AND orders.user_id = $1

        LEFT JOIN users
          ON orders.user_id = users.id

        LEFT JOIN groups
          ON orders.group_id = groups.id

        LEFT JOIN items
          ON ordered_items.item_id = items.id
      `;

    const response = await pool.query(queryStr, values);
    return { ok: true, payload: response.rows };

  } catch (error) {
    console.log('test Fetch User Orders error', error.message);
  }
};



// exports.getGroupOrder = async (groupid, deadline) => {
//   try {
//     const values = [groupid, deadline];
//     const queryStr = `
//       SELECT
//         users.name as userName,
//         items.name as itemName,
//         ordered_items.quantity as orderedQuantity

//       FROM orders

//       JOIN ordered_items
//         ON ordered_items.order_id = orders.id
//         AND orders.group_id = $1 AND orders.date = $2

//       LEFT JOIN users
//         ON orders.user_id = users.id

//       LEFT JOIN items
//         ON ordered_items.item_id = items.id
//     ;`;
//     const res = await pool.query(queryStr, values);

//     return res;
//   } catch (error) {
//     console.log('[group model - getGroupOrder] error', error.message)
//   }
// };