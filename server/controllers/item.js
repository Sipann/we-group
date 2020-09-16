'use strict';

const db = require('../models/item');


//? FOUND BUT ACTION CALLED?
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

//TODO FOUND
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
