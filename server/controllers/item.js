'use strict';

const db = require('../models/item');

exports.fetchGroupItems = async ctx => {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const response = await db.fetchGroupItems(groupid, userid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    if (error.message === 'not allowed') ctx.status = 401;
    ctx.status = 500;
    console.log('[itemCtrl fetchGroupItems] error', error.message);
  }
};


exports.addItemToGroup = async ctx => {
  try {
    const { item, groupid } = ctx.request.body;

    const { userid } = ctx.request.header;
    const response = await db.addItemToGroup(item, groupid, userid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[itemCtrl addItemToGroup] error', error.message);
  }
};

exports.deleteItem = async ctx => {
  try {
    const { itemid } = ctx.params;
    const { userid } = ctx.request.header;
    const response = await db.deleteItemFromGroup(itemid, userid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[itemCtrl deleteItem] error', error.message);
  }
};

exports.deleteItem0 = async ctx => {
  try {
    const { itemid } = ctx.params;
    const res = await db.deleteItem(itemid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[itemCtrl deleteItemFromGroup] error', error.message);
  }
}