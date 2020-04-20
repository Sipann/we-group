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