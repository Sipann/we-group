'use strict';

const db = require('../models/tests');
const dbUtils = require('../models/utils');

exports.deleteGroup = async ctx => {
  try {
    const { groupname } = ctx.params;
    await db.deleteGroup(groupname);
    ctx.body = { ok: true };
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.deleteUser = async ctx => {
  try {
    const { userid } = ctx.params;
    await db.deleteUser(userid);
    ctx.body = { ok: true };
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.getGroupByName = async ctx => {
  try {
    const { groupname } = ctx.params;
    const response = await db.getGroupByName(groupname);
    // console.log('TESTS => response.payload', response.payload);
    if (response.ok) { ctx.body = response.payload; }
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.getLastGroupsUsersAdded = async ctx => {
  try {
    const response = await db.getLastGroupsUsersAdded();
    if (response.ok) { ctx.body = response.payload; }
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.deleteGroupsUsersRow = async ctx => {
  try {
    const { groupsusersid } = ctx.params;
    const response = await db.deleteGroupsUsersRow(groupsusersid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};


exports.getLastAvailableOrderAdded = async ctx => {
  try {
    const response = await db.getLastAvailableOrderAdded();
    if (response.ok) { ctx.body = response.payload; }
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.deleteAvailableOrderRow = async ctx => {
  try {
    const { availableorderid } = ctx.params;
    const response = await db.deleteAvailableOrderRow(availableorderid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.getFirstAvailableOrder = async ctx => {
  try {
    const response = await db.getFirstAvailableOrder();
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.lastInsertedItem = async ctx => {
  try {
    const response = await db.lastInsertedItem();
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.lastInsertedAvailableItem = async ctx => {
  try {
    const response = await db.lastInsertedAvailableItem();
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.deleteItemRow = async ctx => {
  try {
    const { itemid } = ctx.params;
    const response = await db.deleteItemRow(itemid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.deleteAvailableItemRow = async ctx => {
  try {
    const { availableitemid } = ctx.params;
    const response = await db.deleteAvailableItemRow(availableitemid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};


exports.getGroupAvailableOrders = async ctx => {
  try {
    const { groupid } = ctx.params;
    const response = await db.getGroupAvailableOrders(groupid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};


exports.getGroupItems = async ctx => {
  try {
    const { groupid } = ctx.params;
    const response = await db.getGroupItems(groupid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.fetchGroupAvailableOrders = async ctx => {
  try {
    const { groupid } = ctx.params;
    const response = await dbUtils.fetchGroupAvailableOrders(groupid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.fetchAvailableOrderItems = async ctx => {
  try {
    const { orderid } = ctx.params;
    const response = await dbUtils.fetchAvailableOrderItems(orderid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.fetchGroupsUserIsMemberOf = async ctx => {
  try {
    const { userid } = ctx.request.headers;
    const response = await dbUtils.fetchGroupsUserIsMemberOf(userid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};

exports.fetchUserData = async ctx => {
  try {
    const { userid } = ctx.params;
    const response = await dbUtils.fetchUserData(userid);
    if (response.ok) ctx.body = response.payload;
  } catch (error) {
    console.log('[TESTS CTRL] error', error.message);
  }
};



// exports.deleteGroups = async ctx => {
//   try {
//     await db.deleteGroups();
//   } catch (error) {
//     console.log('[TESTS CTRL] error', error.message);
//   }
// };