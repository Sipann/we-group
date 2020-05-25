'use strict';

const pool = require('../models');
const { isUserGroupMember } = require('./utils');

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

exports.updateOrder = async (updatedOrder) => {
  try {
    const response = [];
    // console.log('updatedOrder', updatedOrder);
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
    return response;
  } catch (error) {
    console.log('[order model - updateOrder] error', error.message);
  }
};
