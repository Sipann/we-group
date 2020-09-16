'use strict';

const db = require('../models/user');

const { errorMessages, notAllowed } = require('../utils/errorMessages');

exports.createUser = async ctx => {
  try {
    const user = ctx.request.body;
    const response = await db.createUser(user);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = response.payload;
    }
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[USER CTRL] - createUser error', error.message);
    if (error.message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
    else ctx.throw(500, errorMessages.internalServerError);
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
    // console.log('[USER CTRL] - updateUser error', error.message);
    if (error.message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
    else if (error.message === errorMessages.notAllowed) ctx.throw(401, errorMessages.notAllowed);
    else ctx.throw(500, errorMessages.internalServerError);
  }
};

/////////////////

exports.fetchUserDataCustom = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const response = await db.fetchUserDataCustom(userid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl fetchUserDataCustom] error', error.message);
  }
};






//? ACTION CALLED?
exports.getUser = async ctx => {
  try {
    const res = await db.getUser(ctx.request.header.userid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[userCtrl createUser] error', error.message);
  }
};
