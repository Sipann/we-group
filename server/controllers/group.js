'use strict';

const db = require('../models/group');

exports.getUserGroups = async ctx => {
  try {
    const res = await db.getUserGroups(ctx.request.header.userid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl getUserGroups error]', error.message);
  }
};

exports.getGroup = async ctx => {
  try {
    const res = await db.getGroup(ctx.params.groupid);
    ctx.body = res.rows[0];
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl getGroup error]', error.message);
  }
};

exports.getGroupManageInfos = async ctx => {
  try {
    const res = await db.getGroupManageInfos(ctx.params.groupid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl getGroupManageInfos error]', error.message);
  }
};

exports.getGroupUsers = async ctx => {
  try {
    const res = await db.getGroupUsers(ctx.params.groupid);
    ctx.body = res.rows;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl getGroupUsers error]', error.message);
  }
};

exports.getGroupOrder = async ctx => {
  try {
    const res = await db.getGroupOrder(ctx.params.groupid, ctx.params.deadline);
    ctx.body = res.rows;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl getGroupOrder error]', error.message);
  }
};

exports.createGroup = async ctx => {
  try {
    const res = await db.createGroup(ctx.request.body, ctx.request.header.userid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl createGroup] error', error.message);
  }
};

exports.getGroupItems = async ctx => {
  try {
    const res = await db.getGroupItems(ctx.params.groupid);
    ctx.body = res.rows;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl getGroupItems] error', error.message);
  }
};

exports.deleteGroup = async ctx => {
  try {
    const res = await db.deleteGroup(ctx.params.groupid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl deleteGroup] error', error.message);
  }
};

exports.updateGroupInfos = async ctx => {
  try {
    const data = ctx.request.body;
    const { groupid } = ctx.params;
    const res = await db.updateGroupInfos(data, parseInt(groupid));
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl updateGroupInfos] error', error.message);
  }
};

exports.updateGroupDeadline = async ctx => {
  try {
    const { deadlineDate } = ctx.request.body;
    const { groupid } = ctx.params;
    const res = await db.updateGroupDeadline(deadlineDate, parseInt(groupid));
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl updateGroupDeadline] error', error.message);
  }
};

exports.searchGroups = async ctx => {
  console.log('entering searchGroups with header', ctx.request.header);
  try {
    const { userid } = ctx.request.header;
    const res = await db.searchGroups(userid);
    console.log('[searchGroups] res', res);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl searchGroups] error', error.message);
  }
};

// export.searchGroupsForUser = async ctx => {}



exports.addUserToGroup = async ctx => {
  try {
    const { userid } = ctx.request.header;
    const { groupid } = ctx.params;
    const res = await db.addUserToGroup(userid, groupid);
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    console.log('[groupCtrl addUserToGroup] error', error.message);
  }
}