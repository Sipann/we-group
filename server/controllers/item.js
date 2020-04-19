'use strict';

const db = require('../models/item');

exports.addItemToGroup = async ctx => {
  try {
    const { item, groupid } = ctx.request.body;
    const res = await db.addItemToGroup(item, groupid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[itemCtrl addItemToGroup] error', error.message);
  }
};

exports.deleteItem = async ctx => {
  try {
    const { itemid } = ctx.params;
    const res = await db.deleteItem(itemid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[itemCtrl deleteItemFromGroup] error', error.message);
  }
}