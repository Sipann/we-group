'use strict';

const db = require('../models/order');

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


exports.getAllOrdersForUser = async ctx => {
  try {
    const userid = ctx.request.header.userid;
    const res = await db.getAllOrdersForUser(userid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[orderCtrl getAllOrdersForUser] error', error.message);
  }
};

exports.updateOrder = async ctx => {
  try {
    console.log('updateOrder entering with body', ctx.request.body);
    const updatedOrder = ctx.request.body;
    const res = await db.updateOrder(updatedOrder);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[orderCtrl updateOrder] error', error.message);
  }
};
