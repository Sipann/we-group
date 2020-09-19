'use strict';

const pool = require('../models');
const {
  getGroupIdOfOrder,
  isUserGroupManager,
  isUserGroupMember,
  isUserIdValid,
  isGroupIdValid,
  isAvailableOrderIdValid,
  fetchGroupAvailableOrders,
  fetchAvailableOrderItems,
} = require('./utils');

const { errorMessages } = require('../utils/errorMessages');


exports.createGroup = async (group, manager_id) => {
  try {
    const { name, description, currency } = group;
    if (!name || !description || !currency) throw new Error(errorMessages.missingArguments);
    if (!manager_id) throw new Error(errorMessages.notAllowed);

    await pool.query('BEGIN');

    const groupsValues = [name, description, currency, manager_id];
    const groupsStr = `
      INSERT INTO groups (name, description, currency, manager_id)
        VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const newGroup = await pool.query(groupsStr, groupsValues);
    const insertedGroupId = newGroup.rows[0].id;

    const groupsusersValues = [insertedGroupId, manager_id];
    const groupsusersStr = `
      INSERT INTO groupsusers (group_id, user_id)
        VALUES ($1, $2)`;
    await pool.query(groupsusersStr, groupsusersValues);

    await pool.query('COMMIT');

    return { ok: true, payload: newGroup.rows[0] };

  } catch (error) {
    await pool.query('ROLLBACK');

    // console.log('[GROUP MODEL] - createGroup error', error.message);
    return { ok: false, payload: error.message };
  }
};




exports.addUserToGroup = async (userid, groupid) => {
  try {

    if (!userid) throw new Error(errorMessages.missingArguments);

    const userIdIsValid = await isUserIdValid(userid);
    // console.log('userId', userid, 'IsValid', userIdIsValid);
    const groupIdIsValid = await isGroupIdValid(groupid);
    // console.log('groupId', groupid, 'IsValid', groupIdIsValid);
    if (!userIdIsValid.ok || !groupIdIsValid.ok) throw new Error(errorMessages.missingArguments);

    const userIsGroupMember = await isUserGroupMember(userid, groupid);
    // console.log('GROUPS MODEL userIsGroupMember => ', userIsGroupMember);
    if (userIsGroupMember.ok) throw new Error(errorMessages.unnecessary);

    await pool.query('BEGIN');

    const queryStrAddMember = `
      INSERT INTO groupsusers (user_id, group_id)
        VALUES ($1, $2);`;
    await pool.query(queryStrAddMember, [userid, groupid]);

    const queryStrGroup = `SELECT * FROM groups WHERE id = $1; `;
    const response = await pool.query(queryStrGroup, [groupid]);

    await pool.query('COMMIT');
    // console.log('model response', response.rows[0]);
    return { ok: true, payload: response.rows[0] };

  } catch (error) {
    await pool.query('ROLLBACK');

    // console.log('[GROUP MODEL] - addUserToGroup error', error.message);
    return { ok: false, payload: error.message };
  }
};




exports.updateGroupInfos = async (group, userid) => {
  try {

    if (!group || !group.id || !group.name || !group.description || !userid) throw new Error(errorMessages.missingArguments);
    const userIdIsValid = await isUserIdValid(userid);
    // console.log('userId', userid, 'IsValid', userIdIsValid);
    const groupIdIsValid = await isGroupIdValid(group.id);
    // console.log('groupId', groupid, 'IsValid', groupIdIsValid);
    if (!userIdIsValid.ok || !groupIdIsValid.ok) throw new Error(errorMessages.missingArguments);

    const userIsGroupManager = await isUserGroupManager(userid, group.id);

    if (userIsGroupManager.ok && userIsGroupManager.payload) {
      const values = [group.id, group.name, group.description];
      const queryStr = `
        UPDATE groups
          SET name = $2, description = $3
          WHERE id = $1
        RETURNING *;`;
      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows[0] };
    }
    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    // console.log('[GROUP MODEL] - updateGroup error', error.message);
    return { ok: false, payload: error.message };
  }
};



const doesOrderExist = async (groupid, deliveryTs, deadlineTs) => {
  try {
    const response = await pool.query(
      `SELECT * FROM available_orders WHERE group_id = $1 AND delivery_ts = $2 AND deadline_ts = $3`,
      [groupid, deliveryTs, deadlineTs]);
    if (response.rows.length) return { ok: true, payload: response.rows };
    else return { ok: false, payload: [] };
  } catch (error) {
    console.log('[MODEL GROUPS] - doesOrderExist error', error.message);
  }
};

exports.createNewGroupOrder = async (userid, groupid, newOrder) => {
  try {
    if (!userid || !groupid || !newOrder || !newOrder.deadlineTs || !newOrder.deliveryTs) {
      throw new Error(errorMessages.missingArguments);
    }

    const userIsGroupManager = await isUserGroupManager(userid, groupid);

    if (userIsGroupManager.ok && userIsGroupManager.payload) {
      const { deliveryTs, deadlineTs } = newOrder;
      const values = [groupid, deliveryTs, deadlineTs];

      const orderAlreadyExists = await doesOrderExist(groupid, deliveryTs, deadlineTs);
      if (orderAlreadyExists.ok) throw new Error(errorMessages.unnecessary);
      // console.log('CREATE NEW ORDER EXISTS ? =>', orderAlreadyExists);

      const queryStr = `
        INSERT INTO available_orders (group_id, delivery_ts, deadline_ts)
          VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const response = await pool.query(queryStr, values);
      return { ok: true, payload: response.rows[0] };
    }

    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    // console.log('[MODEL group] createNewGroupOrder error', error.message);
    return { ok: false, payload: error.message };
  }
};



exports.addNewItemToOrder = async (userid, orderid, item) => {
  try {


    if (!userid || !orderid || !item) throw new Error(errorMessages.missingArguments);

    const { itemName, itemDescription } = item;
    if (!itemName || !itemDescription) throw new Error(errorMessages.missingArguments);

    const itemPrice = item.itemPrice ? item.itemPrice : 0;
    const itemInitialQty = item.itemInitialQty ? item.itemInitialQty : 0;

    const userIdIsValid = await isUserIdValid(userid);
    if (!userIdIsValid.ok) throw new Error(errorMessages.notAllowed);
    const availableOrderIdIsValid = await isAvailableOrderIdValid(orderid);
    if (!availableOrderIdIsValid.ok) throw new Error(errorMessages.missingArguments);


    const groupIdOfOrder = await getGroupIdOfOrder(orderid);
    // console.log('ADD NEW ITEM TO ORDER groupid of order', groupIdOfOrder);

    const userIsGroupManager = await isUserGroupManager(userid, groupIdOfOrder);

    if (userIsGroupManager.ok && userIsGroupManager.payload) {

      await pool.query('BEGIN');

      const valuesItems = [itemName, itemDescription, itemPrice, groupIdOfOrder];
      const queryStrItems = `
        INSERT INTO items (name, description, price, group_id)
          VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const itemsResponse = await pool.query(queryStrItems, valuesItems);
      const itemid = itemsResponse.rows[0].id;

      const valuesAvailableItems = [itemid, itemInitialQty, orderid];
      const queryStrAvailableItems = `
        INSERT INTO available_items (item_id, initial_qty, remaining_qty, available_order_id)
          VALUES ($1, $2, $2, $3)
        RETURNING *;
        `;
      const availableItemsResponse = await pool.query(queryStrAvailableItems, valuesAvailableItems);
      // console.log('availableItemsResponse', availableItemsResponse.rows[0]);
      const availableItemId = availableItemsResponse.rows[0].id;

      // sent back
      const valuesAddedItem = [availableItemId, orderid];
      const queryStrAddedItem = `
        SELECT
          available_items.id as availableItemId,
          available_items.initial_qty as availableItemInitialQty,
          available_items.remaining_qty as availableItemRemainingQty,
          items.id as itemid,
          items.name as itemName,
          items.description as itemDescription,
          items.price as itemPrice
        FROM available_items
        JOIN items
          ON available_items.item_id = items.id
          AND available_items.id = $1
          AND available_items.available_order_id = $2;
      `;
      const addedItemResponse = await pool.query(queryStrAddedItem, valuesAddedItem);
      // console.log('ADD NEW ITEM TO ORDER addedItemResponse', addedItemResponse.rows[0]);

      await pool.query('COMMIT');

      return { ok: true, payload: addedItemResponse.rows[0] }
    }

    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    // console.log('[MODEL group] addItemToOrder error', error.message);
    return { ok: false, payload: error.message };
  }
};



const returnAddedItem = async (addedToOrderItemId, orderid) => {
  const queryStrAddedItem = `
      SELECT
          available_items.id as availableItemId,
          available_items.initial_qty as availableItemInitialQty,
          available_items.remaining_qty as availableItemRemainingQty,
          items.id as itemid,
          items.name as itemName,
          items.description as itemDescription,
          items.price as itemPrice
        FROM available_items
        JOIN items
          ON available_items.item_id = items.id
          AND available_items.id = $1
          AND available_items.available_order_id = $2;
      `;
  const addedItemResponse = await pool.query(queryStrAddedItem, [addedToOrderItemId, orderid]);
  return addedItemResponse.rows[0];
};

exports.addExistingItemToOrder = async (userid, orderid, itemData) => {
  try {

    if (!userid || !itemData || !Object.keys(itemData).length) throw new Error(errorMessages.missingArguments);

    const { itemid, initialQty } = itemData;
    if (!itemid || !initialQty) throw new Error(errorMessages.missingArguments);

    const availableOrderIdIsValid = await isAvailableOrderIdValid(orderid);
    if (!availableOrderIdIsValid.ok) throw new Error(errorMessages.missingArguments);

    const groupIdOfOrder = await getGroupIdOfOrder(orderid);
    // console.log('ADD EXISTING ITEM TO ORDER - groupid of order', groupIdOfOrder);

    const userIsGroupManager = await isUserGroupManager(userid, groupIdOfOrder);

    if (userIsGroupManager.ok && userIsGroupManager.payload) {
      // const { itemid, initialQty } = item;
      // console.log('MODELS itemid =>', itemid, 'initialQty =>', initialQty);

      await pool.query('BEGIN');

      const valuesItems = [itemid, initialQty, orderid];
      const queryStrItems = `
        INSERT INTO available_items (item_id, initial_qty, remaining_qty, available_order_id)
          VALUES ($1, $2, $2, $3)
        RETURNING *;
      `;
      const itemsResponse = await pool.query(queryStrItems, valuesItems);
      const addedToOrderItemId = itemsResponse.rows[0].id;

      // sent back
      // const valuesAddedItem = [addedToOrderItemId, orderid];
      // const queryStrAddedItem = `
      // SELECT
      //     available_items.id as availableItemId,
      //     available_items.initial_qty as availableItemInitialQty,
      //     available_items.remaining_qty as availableItemRemainingQty,
      //     items.id as itemid,
      //     items.name as itemName,
      //     items.description as itemDescription,
      //     items.price as itemPrice
      //   FROM available_items
      //   JOIN items
      //     ON available_items.item_id = items.id
      //     AND available_items.id = $1
      //     AND available_items.available_order_id = $2;
      // `;
      // const addedItemResponse = await pool.query(queryStrAddedItem, valuesAddedItem);
      // console.log('ADD EXISTING ITEM TO ORDER response', addedItemResponse.rows[0]);
      const addedItemResponse = await returnAddedItem(addedToOrderItemId, orderid);

      await pool.query('COMMIT');

      return { ok: true, payload: addedItemResponse };

    }

    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    await pool.query('ROLLBACK');
    // console.log('[MODEL group] addExistingItemToOrder error', error.message);
    return { ok: false, payload: error.message };
  }
};



exports.fetchGroupMembers = async (userid, groupid) => {
  try {

    if (!userid) throw new Error(errorMessages.missingArguments);

    const userIsGroupManager = await isUserGroupManager(userid, groupid);

    if (userIsGroupManager.ok && userIsGroupManager.payload) {
      const queryStr = `
        SELECT
          users.id as userid,
          users.name as username
        FROM users
        JOIN groupsusers ON users.id = groupsusers.user_id AND groupsusers.group_id = $1;`;
      const response = await pool.query(queryStr, [groupid]);
      return { ok: true, payload: response.rows };
    }

    else throw new Error(errorMessages.notAllowed);

  } catch (error) {
    // console.log('[GROUP MODEL] - fetchGroupMembers error', error.message);
    return { ok: false, payload: error.message };
  }
};



exports.fetchGroupFullAvailableOrders = async (userid, groupid) => {
  try {

    if (!userid) throw new Error(errorMessages.missingArguments);

    const userIsGroupMember = await isUserGroupMember(userid, groupid);
    if (!userIsGroupMember.ok) throw new Error(errorMessages.notAllowed);

    const availableOrdersResponse = await fetchGroupAvailableOrders(groupid);
    if (!availableOrdersResponse.ok) throw new Error(errorMessages.internalServerError);
    const response = {};

    const availableOrders = availableOrdersResponse.payload;

    for (let order of availableOrders) {
      const orderItemsResponse = await fetchAvailableOrderItems(order.id);
      if (!orderItemsResponse.ok) throw new Error(errorMessages.internalServerError);

      response[order.id] = {
        deadlineTs: order.deadline_ts,
        deliveryTs: order.delivery_ts,
        deliveryStatus: order.delivery_status,
        confirmedStatus: order.confirmed_status,
        items: orderItemsResponse.payload,
      };
    }

    return { ok: true, payload: response };

  } catch (error) {
    // console.log('[GROUP MODEL] fetchGroupFullAvailableOrders error', error.message);
    return { ok: false, payload: error.message };
  }
};



exports.searchGroups = async userid => {
  try {
    const userIdIsValid = await isUserIdValid(userid);
    if (!userIdIsValid.ok) throw new Error(errorMessages.notAllowed);

    const searchGroupsQueryStr = `
      SELECT
        groups.id as group_id,
        groups.name as group_name,
        groups.description as group_description,
        groups.manager_id as group_manager_id
      FROM groups
        WHERE groups.id IN (
          SELECT group_id FROM groupsusers
            WHERE group_id NOT IN (
              SELECT group_id FROM groupsusers WHERE user_id = $1
            )
        )`;

    const searchGroups = await pool.query(searchGroupsQueryStr, [userid]);
    return { ok: true, payload: searchGroups.rows };

  } catch (error) {
    // console.log('[GROUP MODEL] - searchGroups error', error.message);
    return { ok: false, payload: error.message };
  }
};


////////////////


exports.fetchGroupOrders = async (userid, groupid) => {
  try {
    const userIsGroupManager = await isUserGroupManager(userid, groupid);
    if (userIsGroupManager.ok && userIsGroupManager.payload) {
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
