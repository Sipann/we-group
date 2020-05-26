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

exports.fetchOrderGroupUser = async ctx => {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    console.log('ENTERING FETCHORDERGROUPUSER with groupid', groupid, 'userid', userid);
    const response = await db.fetchOrderGroupUser(userid, groupid);
    console.log('CTRL response', response);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[orderCtrl createOrder] error', error.message);
  }
}


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
