'use strict';

const db = require('../models/group');

const { errorMessages, notAllowed } = require('../utils/errorMessages');
const { handleErrorCtrl } = require('./utils');

exports.createGroup = async ctx => {
  try {
    const group = ctx.request.body;
    const { userid } = ctx.request.header;
    const response = await db.createGroup(group, userid);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = response.payload;
    }
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] - createGroup error', error.message);
    if (error.message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
    else if (error.message === errorMessages.notAllowed) ctx.throw(401, errorMessages.notAllowed);
    else ctx.throw(500, errorMessages.internalServerError);
  }
};




exports.addUserToGroup = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const { groupid } = ctx.params;
    const response = await db.addUserToGroup(userid, groupid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] - addUserToGroup error', error.message);
    if (error.message === errorMessages.unnecessary) ctx.throw(202, errorMessages.unnecessary);
    else if (error.message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
    else ctx.throw(500, errorMessages.internalServerError);
  }
};




exports.updateGroupInfos = async ctx => {
  try {
    const group = ctx.request.body;
    const { userid } = ctx.request.header;
    const response = await db.updateGroupInfos(group, userid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] - updateGroupInfos error', error.message);
    if (error.message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
    if (error.message === errorMessages.notAllowed) ctx.throw(401, errorMessages.notAllowed);
    else ctx.throw(500, errorMessages.internalServerError);
  }
};


exports.createNewGroupOrder = async ctx => {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const newOrder = ctx.request.body;
    const response = await db.createNewGroupOrder(userid, groupid, newOrder);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = response.payload;
    }
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] - createNewGroupOrder error', error.message);
    handleErrorCtrl(ctx, error.message);
  }
};


exports.addNewItemToOrder = async ctx => {
  try {
    const { orderid } = ctx.params;
    const { userid } = ctx.request.header;
    const item = ctx.request.body;
    const response = await db.addNewItemToOrder(userid, orderid, item);
    // console.log('CTRL addItemToOrder response', response);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = response.payload;
    }
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] - addItemToOrder error', error.message);
    handleErrorCtrl(ctx, error.message);
  }
};




exports.addExistingItemToOrder = async ctx => {
  try {
    const { orderid } = ctx.params;
    const { userid } = ctx.request.header;
    const itemData = ctx.request.body;
    // console.log('CTRL addItemToOrder orderid', orderid);
    // console.log('CTRL addItemToOrder userid', userid);
    // console.log('CTRL addItemToOrder item', item);
    const response = await db.addExistingItemToOrder(userid, orderid, itemData);
    if (response.ok) {
      ctx.status = 201;
      ctx.body = response.payload;
    }
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] addExistingItemToOrder error', error.message);
    handleErrorCtrl(ctx, error.message);
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
    // console.log('[GROUP CTRL] - fetchGroupMemebrs error', error.message);
    handleErrorCtrl(ctx, error.message);
  }
};







exports.fetchGroupFullAvailableOrders = async ctx => {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const response = await db.fetchGroupFullAvailableOrders(userid, groupid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] fetchGroupAvailableOrders error', error.message);
    handleErrorCtrl(ctx, error.message);
  }
};


exports.searchGroups = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const response = await db.searchGroups(userid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    // console.log('[GROUP CTRL] - searchGroups error', error.message);
    handleErrorCtrl(ctx, error.message);
  }
};

//////////////////

exports.fetchGroupOrders = async ctx => {
  try {
    const { groupid } = ctx.params;
    const { userid } = ctx.request.header;
    const response = await db.fetchGroupOrders(userid, groupid);
    if (response.ok) ctx.body = response.payload;
    else throw new Error(response.payload);
  } catch (error) {
    ctx.status = 500;
    console.log('[testCtrl] fetchGroupOrders', error.message);
  }
};
