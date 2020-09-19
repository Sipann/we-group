import pool from '../models';
import { fetchGroupFullAvailableOrders } from './group';

import { errorMessages } from '../utils/errorMessages';



export async function handleErrorModel (error) {
  return { ok: false, payload: error.message };
}





export async function getGroupOfItem (itemid) {
  try {
    const values = [itemid];
    const queryStr = `
      SELECT group_id FROM items
      WHERE id = $1;
    `;
    const response = await pool.query(queryStr, values);
    return response.rows[0].group_id;
  } catch (error) {
    console.log('[item model - getGroupOfItem]', error.message);
  }
}


export async function getGroupIdOfOrder (orderid) {
  try {
    const values = [orderid];
    const queryStr = `
      SELECT group_id FROM available_orders
      WHERE id = $1;
    `;
    const response = await pool.query(queryStr, values);
    if (response.rows.length) return { ok: true, payload: response.rows[0].group_id };
    else throw new Error(errorMessages.invalidInput);
    // return response.rows[0].group_id;

  } catch (error) {
    // console.log('[UTILS MODEL] getGroupIdOfOrder error', error.message);
    return { ok: false, payload: error.message };
  }
}


export async function isUserGroupManager (userid, groupid) {
  try {
    const values = [groupid];
    const queryStr = `
      SELECT manager_id from GROUPS
      WHERE id = $1;
    `;
    const groupManagerId = await pool.query(queryStr, values);
    if (groupManagerId.rows.length) {
      return { ok: true, payload: groupManagerId.rows[0].manager_id === userid };
    }
    else throw new Error(errorMessages.invalidInput);
    // return groupManagerId.rows[0].manager_id === userid;
  } catch (error) {
    // console.log('[UTILS - isUserGroupManager db err]', error.message);
    return { ok: false, payload: error.message };
  }
}

const getGroupUsers = async (groupid) => {
  // console.log('getGroupUsers groupid', groupid);
  try {
    const values = [groupid];
    const queryStr = `
      SELECT
        users.id as id,
        users.name as name
      FROM users
      JOIN groupsusers ON users.id = groupsusers.user_id and groupsusers.group_id = $1;`;
    const res = await pool.query(queryStr, values);
    // console.log('getGroupUsers res', res.rows);
    return res.rows;
  } catch (error) {
    console.log('[group model - getGroupUsers db] error', error.message);
  }
};


export async function isUserGroupMember (userid, groupid) {
  // console.log('ENTERING isUserGroupMember with userid', userid, 'and groupid', groupid);
  try {
    const groupMembers = await getGroupUsers(groupid);
    // console.log('groupMembers response => ', groupMembers);
    // if (groupMembers.rows.find(member => member.id === userid)) {
    if (groupMembers.find(member => member.id === userid)) {
      // console.log('groupMember found');
      return { ok: true, payload: true };
    }
    else {
      // console.log('groupMember NOT found');
      return { ok: false, payload: false };
    }
  } catch (error) {
    console.log('[UTILS - isUserGroupMember db] err', error.message);
  }
}


export async function isUserIdValid (userid) {
  try {
    const response = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userid]
    );
    if (response.rows.length) { return { ok: true } }
    else { return { ok: false } }
  } catch (error) {
    console.log('[UTILS - isUserIdValid db] err', error.message);
  }
}

export async function isGroupIdValid (groupid) {
  try {
    const response = await pool.query(
      `SELECT * FROM groups WHERE id = $1`,
      [groupid]
    );
    if (response.rows.length) { return { ok: true } }
    else { return { ok: false } }
  } catch (error) {
    console.log('[UTILS - isGroupIdValid db] err', error.message);
  }
}

export async function isAvailableOrderIdValid (orderid) {
  try {
    const response = await pool.query(
      `SELECT * FROM available_orders WHERE id = $1`,
      [orderid]
    );
    if (response.rows.length) { return { ok: true } }
    else { return { ok: false } }
  } catch (error) {
    console.log('[UTILS - isGroupIdValid db] err', error.message);
  }
}


export async function fetchGroupAvailableOrders (groupid) {
  try {

    const now = new Date();
    const values = [groupid, now];
    const queryStr = `
      SELECT * FROM available_orders
        WHERE group_id = $1 AND delivery_ts > $2;
    `;
    const response = await pool.query(queryStr, values);
    return { ok: true, payload: response.rows };

  } catch (error) {
    // console.log('[GROUP MODEL] fetchGroupAvailableOrders error', error.message);
    return { ok: false, payload: error.message };
  }
}


export async function fetchAvailableOrderItems (orderid) {
  try {
    const queryStr = `
      SELECT
        available_items.id as available_item_id,
        available_items.initial_qty as available_item_initial_qty,
        available_items.remaining_qty as available_item_remaining_qty,
        items.id as item_id,
        items.name as item_name,
        items.description as item_description,
        items.price as item_price
      FROM available_items
      JOIN items
        ON available_items.item_id = items.id
        AND available_items.available_order_id = $1;
    `;
    const availableOrderItems = await pool.query(queryStr, [orderid]);
    return { ok: true, payload: availableOrderItems.rows };

  } catch (error) {
    return { ok: false, payload: error.message };
  }
}


export async function fetchGroupsUserIsMemberOf (userid) {
  try {
    const userGroupsQueryStr = `
      SELECT
        groups.id as id,
        groups.name as name,
        groups.description as description,
        groups.manager_id as manager_id
      FROM groups
      INNER JOIN groupsusers ON groups.id = groupsusers.group_id AND groupsusers.user_id = $1;
    `;
    const userGroups = await pool.query(userGroupsQueryStr, [userid]);
    return { ok: true, payload: userGroups.rows };
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}

export async function fetchFullGroupsUserIsMemberOf (userid) {
  const userGroupsComplete = [];

  const userGroupsResponse = await fetchGroupsUserIsMemberOf(userid);
  const userGroups = userGroupsResponse.rows;

  for (let group of userGroups) {
    if (group.manager_id === userid) {
      const availableOrders = await fetchGroupFullAvailableOrders(userid, group.id)
      userGroupsComplete.push({
        ...group,
        availableOrders,
      });

      // const queryStr = `SELECT * FROM items WHERE group_id = $1;`;
      // const groupItemsResponse = await pool.query(queryStr, [group.id]);
      // const groupItems = groupItemsResponse.rows;
      // userGroupsComplete.push({
      //   ...group,
      //   items: groupItems
      // });
    }
    else userGroupsComplete.push(group);
  }
  return userGroupsComplete;
}

export async function fetchUserData (userid) {
  try {
    const userDetailsQueryStr = `SELECT * FROM users WHERE id = $1;`;
    const userDetails = await pool.query(userDetailsQueryStr, [userid]);
    return { ok: true, payload: userDetails.rows[0] }
  } catch (error) {
    return { ok: false, payload: error.message };
  }
}


export const notAllowed = { ok: false, payload: errorMessages.notAllowed };

export const missingArguments = { ok: false, payload: errorMessages.missingArguments };
