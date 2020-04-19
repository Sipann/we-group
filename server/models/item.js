'use strict';

const pool = require('../models');

exports.addItemToGroup = async (item, groupid) => {
  try {
    const { name, description, price, currency, initial_qty } = item;
    const values = [name, description, price, currency, initial_qty, groupid];
    const queryStr = `
      INSERT INTO items (name, description, price, currency, initial_qty, remaining_qty, group_id)
      VALUES ($1, $2, $3, $4, $5, $5, $6); `;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[item model - addItemToGroup db err]', error.message);
  }
};

exports.deleteItem = async (itemid) => {
  try {
    const values = [itemid];
    const queryStr = `
      DELETE FROM items
        WHERE id = $1;`;
    const res = await pool.query(queryStr, values);
    return res;
  } catch (error) {
    console.log('[item model - deleteItemFromGroup db err]', error.message);
  }
}
