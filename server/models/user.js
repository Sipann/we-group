'use strict';

const pool = require('../models');
const { isUserGroupManager } = require('./utils');

exports.fetchUserData = async userid => {
  //TODO transaction
  try {
    const values = [userid];
    const userDetailsQueryStr = `
      SELECT * FROM users
      WHERE id = $1;`;
    const userDetails = await pool.query(userDetailsQueryStr, values);

    const userGroupsQueryStr = `
      SELECT
        groups.id as id,
        groups.name as name,
        groups.description as description,
        groups.manager_id as manager_id,
        groups.deadline as deadline
      FROM groups
      INNER JOIN groupsusers ON groups.id = groupsusers.group_id AND groupsusers.user_id = $1;
    `;
    const userGroups = await pool.query(userGroupsQueryStr, values);
    // console.log('MODELS USER FETCH USER DATA userGroups.rows', userGroups.rows);
    return { userDetails: userDetails.rows[0], userGroups: userGroups.rows };

  } catch (error) {
    console.log('[user model - fetchUserData] error', error.message);
  }
};


exports.fetchGroupMembers = async (userid, groupid) => {
  try {
    if (isUserGroupManager(userid, groupid)) {
      const values = [groupid];
      const queryStr = `
      SELECT
        users.id as id,
        users.name as name
      FROM users
      JOIN groupsusers ON users.id = groupsusers.user_id and groupsusers.group_id = $1;`;
      const res = await pool.query(queryStr, values);
      return { ok: true, payload: res.rows };
    }
    else {
      return { ok: false, payload: 'not allowed' };
    }
  } catch (error) {
    console.log('[user model - fetchGroupMembers] error', error.message);
  }
};



exports.createUser = async user => {
  try {
    const { id, name, email } = user;
    const values = [id, name, email, 'email'];
    const queryStr = `
      INSERT INTO users (id, name, email, preferred_contact_mode)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;
    const res = await pool.query(queryStr, values);
    return res.rows[0];
  } catch (error) {
    console.log('[user model - createUser db err]', error.message);
  }
};

exports.getUser = async userid => {
  try {
    const values = [userid];
    const queryStr = `
      SELECT * FROM users
      WHERE id = $1;`;
    const res = await pool.query(queryStr, values);
    return res.rows[0];
  } catch (error) {
    console.log('[user model - getUser db err]', error.message);
  }
};

exports.updateUser = async (userid, user) => {
  try {
    const { name, email, phone, preferred_contact_mode } = user;
    const values = [name, email, phone, preferred_contact_mode, userid];
    const queryStr = `
      UPDATE users
        SET name = $1, email = $2, phone = $3, preferred_contact_mode = $4
      WHERE id = $5
      RETURNING *`;
    const res = await pool.query(queryStr, values);
    return res.rows[0];
  } catch (error) {
    console.log('[user model - updateUser db err]', error.message);
  }
};

exports.deleteUser = async userid => {
  try {
    const valuesUsers = [userid];
    const queryStrUsers = `
      DELETE FROM users
      WHERE id = $1;`;
    await pool.query(queryStrUsers, valuesUsers);

  } catch (error) {
    console.log('[user model - deleteUser db err]', error.message);
  }
}