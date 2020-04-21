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

exports.getUser = async ctx => {
  try {
    const res = await db.getUser(ctx.request.header.userid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl createUser] error', error.message);
  }
};

exports.updateUser = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const user = ctx.request.body;
    const res = await db.updateUser(userid, user);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl createUser] error', error.message);
  }
};

exports.deleteUser = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const res = await db.deleteUser(userid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl deleteUser] error', error.message);
  }
}