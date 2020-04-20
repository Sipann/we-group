'use strict';

const db = require('../models/user');

exports.createUser = async ctx => {
  try {
    const user = ctx.request.body;
    const res = await db.createUser(user);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl createUser] error', error.message);
  }
};