'use strict';

const pool = require('../models');
const {
  getGroupIdOfOrder,
  isUserGroupMember,
  isAvailableOrderIdValid,
  isUserIdValid,
} = require('./utils');

const { errorMessages } = require('../utils/errorMessages');

///////////////////////////

exports.placeOrder = async (userid, availableorderid, items) => {
  console.log('PLACE ORDER MODELS items', items);
  try {

    const availableOrderIdIsValid = await isAvailableOrderIdValid(availableorderid);
    if (!availableOrderIdIsValid.ok) throw new Error(errorMessages.missingArguments);

    const userIdIsValid = await isUserIdValid(userid);
    if (!userIdIsValid.ok) throw new Error(errorMessages.notAllowed);

    const groupIdOfOrder = await getGroupIdOfOrder(availableorderid);
    if (!groupIdOfOrder.ok) throw new Error(errorMessages.invalidInput);

    const userIsGroupMember = await isUserGroupMember(userid, roupIdOfOrder.payload);
    if (!userIsGroupMember.ok) throw new Error(errorMessages.notAllowed);

    for (let item of items) {
      const { availableitemid, itemid, orderedQty } = item;

      await pool.query('BEGIN');

      const orderedItemsQueryStr = `
        INSERT INTO ordered_items (quantity, item_id, order_id)
          VALUES ($1, $2, $3);
      `;
      await pool.query(orderedItemsQueryStr, [orderedQty, itemid, availableorderid]);

      const availableItemsQueryStr = `
        UPDATE available_items
          SET remaining_qty = remaining_qty - $1
        WHERE id = $2;
      `;
      await pool.query(availableItemsQueryStr, [orderedQty, availableitemid]);

      await pool.query('COMMIT');
    }

    return { ok: true, payload: [] }; //! Return same content as fetchOrders when done





    // //TODO transaction
    // //TODO replace orders table with orders_placed
    // // const groupIdOfOrder = await getGroupIdOfOrder(availableorderid);

    // // const userIsGroupMember = await isUserGroupMember(userid, groupIdOfOrder)

    // // if (userIsGroupMember) {

    //   // create order in orders (placed)
    //   const valuesOrdersPlaced = [userid, availableorderid, groupIdOfOrder];
    //   const queryStrOrdersPlaced = `
    //     INSERT INTO orders (user_id, order_available_id, group_id)
    //       VALUES ($1, $2, $3)
    //     RETURNING *;
    //   `;
    //   const responseOrdersPlaced = await pool.query(queryStrOrdersPlaced, valuesOrdersPlaced);

    //   const orderPlacedId = responseOrdersPlaced.rows[0].id;
    //   console.log('orderPlacedId', orderPlacedId);

    //   // create ordered item in ordered_items with order.id (from order placed)
    //   //! revoir les arguments
    //   for (let item of items) {
    //     console.log('item', item);
    //     const valuesOrderedItem = [item.itemid, orderPlacedId, item.orderedQty]
    //     const queryStrOrderedItem = `
    //       INSERT INTO ordered_items (item_id, order_id, quantity)
    //         VALUES ($1, $2, $3);
    //     `;
    //     await pool.query(queryStrOrderedItem, valuesOrderedItem);

    //     // update available remaining_qty in items_available
    //     const valuesAvailableItems = [item.orderedQty, item.availableitemid];
    //     const queryStrAvailableItems = `
    //     UPDATE available_items
    //       SET remaining_qty = remaining_qty - $1
    //     WHERE id = $2;
    //   `;
    //     await pool.query(queryStrAvailableItems, valuesAvailableItems);
    //   }

    // Return response
    // const createdOrder = await fetchUserOrder(orderPlacedId);
    // console.log('createdOrder', createdOrder);
    // if (createdOrder.ok) return { ok: true, payload: createdOrder.payload };
    // }

    // else {
    //   return { ok: false, payload: 'not allowed' };
    // }

  } catch (error) {
    // console.log('[ORDER MODEL] - placeOrder error', error.message);
    return { ok: false, payload: error.message };
  }
};




exports.fetchUserOrders = async userid => {
  try {
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

    const response = await pool.query(queryStr, [userid]);
    return { ok: true, payload: response.rows };

  } catch (error) {
    // console.log('[ORDERS MODEL] fetchUserOrders error', error.message);
    return { ok: false, payload: error.message };
  }
};




//? FOUND ACTION CALLED?
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


//? FOUND ACTION CALLED?
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


//? FOUND ACTION CALLED?
exports.updateOrder = async (userid, updatedOrder) => {
  try {
    // AWAIT
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



//? TO BE CHECKED IF STILL USED (in upateOrder)
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
