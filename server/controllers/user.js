'use strict';

const db = require('../models/user');


exports.fetchUserData = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const res = await db.fetchUserData(userid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl fetchUserData] error', error.message);
  }
};


exports.fetchGroupMembers = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const { groupid } = ctx.params;
    const response = await db.fetchGroupMembers(userid, groupid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl fetchGroupMemebrs] error', error.message);
  }
};


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
    const response = await db.updateUser(userid, user);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
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