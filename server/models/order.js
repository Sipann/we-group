'use strict';

const pool = require('../models');
const { isUserGroupMember } = require('./utils');

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


exports.createOrder = async (groupid, userid, date, items) => {
  try {
    if (isUserGroupMember(userid, groupid)) {

      const valuesOrder = [groupid, userid, date];
      const queryStrOrder = `
      INSERT INTO orders (group_id, user_id, date)
      VALUES ($1, $2, $3)
      RETURNING id;`;
      const resOrder = await pool.query(queryStrOrder, valuesOrder);
      const orderid = +resOrder.rows[0].id;
      console.log('[order model createOrder] orderid', orderid);

      for (let item of items) {
        const valuesOrderedItem = [item.quantity, item.itemid, orderid];
        const queryStrOrderedItem = `
        INSERT INTO ordered_items (quantity, item_id, order_id)
        VALUES ($1, $2, $3)`;
        await pool.query(queryStrOrderedItem, valuesOrderedItem);

        const valuesItem = [item.quantity, item.itemid];
        const queryStrItem = `
        UPDATE items
        SET remaining_qty = remaining_qty - $1
        WHERE id = $2;`;
        await pool.query(queryStrItem, valuesItem);

      }
      return { ok: true, payload: { date, orderid, items } };
    }
    else {
      return { ok: false, payload: 'not allowed' };
    }

  } catch (error) {
    console.log('[order model - createOrder db err]', error.message);
  }
};


exports.fetchOrderGroupUser = async (userid, groupid) => {
  try {
    const values = [userid, groupid];
    const queryStr = `
      SELECT
          orders.id as orderid,
          orders.date as orderdeadline,
          orders.group_id as ordergroup,
          ordered_items.id as orderedid,
          ordered_items.quantity as orderedqty,
          items.id as itemid,
          items.name as itemname,
          items.price as itemprice,
          groups.name as groupname,
          groups.id as groupid
        FROM orders
        INNER JOIN ordered_items
          ON ordered_items.order_id = orders.id
          AND orders.user_id = $1
        LEFT JOIN items
          ON items.id = ordered_items.item_id
        INNER JOIN groups
          ON groups.id = orders.group_id
          AND orders.group_id = $2;
    `;

    const orders = await pool.query(queryStr, values);
    console.log('ORDERS', orders);
    return { ok: true, payload: orders.rows };

  } catch (error) {
    console.log('[order model - fetchOrderGroupUser db err]', error.message);
    return { ok: false, payload: 'an error occurred' };
  }
};

exports.getAllOrdersForUser = async (userid) => {
  try {
    const values = [userid];
    const queryStr = `
      SELECT
        orders.id as orderid,
        orders.date as orderdeadline,
        orders.group_id as ordergroup,
        ordered_items.id as orderedid,
        ordered_items.quantity as orderedqty,
        items.id as itemid,
        items.name as itemname,
        items.price as itemprice,
        groups.name as groupname
      FROM orders
      INNER JOIN ordered_items
        ON ordered_items.order_id = orders.id
        AND orders.user_id = $1
      LEFT JOIN items
        ON items.id = ordered_items.item_id
      LEFT JOIN groups
        ON groups.id = orders.group_id;`;

    const res = await pool.query(queryStr, values);
    return res.rows;
  } catch (error) {
    console.log('[order model - getAllOrdersForUser] error', error.message);
  }
};

const isUserOrderOwner = async (userid, orderid) => {
  try {
    const values = [orderid];
    const queryStr = `
      SELECT user_id FROM orders
        WHERE id = $1;
    `;
    const orderUserId = await pool.query(queryStr, values);
    return orderUserId.rows[0].user_id == userid;
  } catch (error) {
    console.log('ORDER isUserOrderOwner error', error.message);
  }
};


exports.updateOrder = async (userid, updatedOrder) => {
  try {

    if (isUserOrderOwner(userid, updatedOrder[0].orderid)) {
      const response = [];
      for (let item of updatedOrder) {
        const values = [item.orderedid, item.quantityChange];
        const queryStr = `
        UPDATE ordered_items
          SET quantity = quantity + $2
        WHERE id = $1
        RETURNING *;`;
        const res = await pool.query(queryStr, values);

        const valuesItems = [item.itemid, item.quantityChange];
        const queryStrItems = `
        UPDATE items
          SET remaining_qty = remaining_qty - $2
        WHERE id = $1;`;
        await pool.query(queryStrItems, valuesItems);

        response.push(res.rows[0]);
      }
      console.log('response', response);
      return { ok: true, payload: response };
      // return response;
    }
    else {
      return { ok: false, payload: 'not allowed' }
    }
  } catch (error) {
    console.log('[order model - updateOrder] error', error.message);
  }
};


// exports.updateOrder = async (updatedOrder) => {
//   try {
//     const response = [];
//     // console.log('updatedOrder', updatedOrder);
//     for (let item of updatedOrder) {
//       const values = [item.orderedid, item.quantityChange];
//       const queryStr = `
//         UPDATE ordered_items
//           SET quantity = quantity + $2
//         WHERE id = $1
//         RETURNING *;`;
//       const res = await pool.query(queryStr, values);

//       const valuesItems = [item.itemid, item.quantityChange];
//       const queryStrItems = `
//         UPDATE items
//           SET remaining_qty = remaining_qty - $2
//         WHERE id = $1;`;
//       await pool.query(queryStrItems, valuesItems);

//       response.push(res.rows[0]);
//     }
//     return response;
//   } catch (error) {
//     console.log('[order model - updateOrder] error', error.message);
//   }
// };
