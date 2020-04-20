'use strict';

const pool = require('../models');

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