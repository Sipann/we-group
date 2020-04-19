'use strict';

const db = require('../models/order');

exports.createOrder = async ctx => {
  try {
    const { groupid } = ctx.params;
    const userid = ctx.request.header.userid;
    const { date, items } = ctx.request.body;
    const res = await db.createOrder(groupid, userid, date, items);
    ctx.body = res;
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
