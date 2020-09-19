'use strict';

const db = require('../models/order');
const { handleErrorCtrl } = require('./utils');

//////////////////////////

exports.placeOrder = async ctx => {
  try {
    console.log('ENTERING PLACEORDER CTRL');

    const { availableorderid } = ctx.params;
    const { userid } = ctx.request.header;
    const itemsordered = ctx.request.body;

    console.log('PLACEORDER CTRL :: availableorderid =>', availableorderid, 'userid =>', userid, 'items =>', itemsordered);

    const response = await db.placeOrder(userid, availableorderid, itemsordered);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[ORDER CTRL] placeOrder error', error.message);
    handleErrorCtrl(ctx, error.message);
  }
};



exports.fetchUserOrders = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const response = await db.fetchUserOrders(userid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[testCtrl] fetchUserOrders', error.message);
  }
};



//? FOUND BUT ACTION CALLED?
exports.createOrder = async ctx => {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const { date, items } = ctx.request.body;
    const response = await db.createOrder(groupid, userid, date, items);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[orderCtrl createOrder] error', error.message);
  }
};

//? FOUND BUT ACTION CALLED?
exports.fetchOrderGroupUser = async ctx => {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const response = await db.fetchOrderGroupUser(userid, groupid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[orderCtrl createOrder] error', error.message);
  }
}

//? FOUND BUT ACTION CALLED?
exports.updateOrder = async ctx => {
  try {
    const updatedOrder = ctx.request.body;
    const { userid } = ctx.request.header;
    const response = await db.updateOrder(userid, updatedOrder);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[orderCtrl updateOrder] error', error.message);
  }
};
