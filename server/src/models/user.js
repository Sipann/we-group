'use strict';

import pool from '../models';
import { isUserGroupManager, fetchGroupsUserIsMemberOf, fetchUserData, isUserIdValid, missingArguments, notAllowed } from './utils';
import { fetchUserOrders } from './order';
import { errorMessages } from '../utils/errorMessages';


const isUserDataOwner = async (userid, user) => {
  try {
    const values = [userid];
    const queryStr = `
      SELECT email FROM users
        WHERE id = $1;
    `;
    const res = await pool.query(queryStr, values);
    return user.email === res.rows[0].email;

  } catch (error) {
    console.log('[user model - isUserDataOwner db err]', error.message);
  }
}


// exports.createUser = async user => {
//   try {
//     const { id, name, email } = user;
//     const values = [id, name, email, 'email'];
//     const queryStr = `
//       INSERT INTO users (id, name, email, preferred_contact_mode)
//       VALUES ($1, $2, $3, $4)
//       RETURNING *;`;
//     const res = await pool.query(queryStr, values);
//     return res.rows[0];
//   } catch (error) {
//     console.log('[user model - createUser db err]', error.message);
//   }
// };

exports.createUser = async (user) => {
  try {
    const { id, name, email } = user;
    if (!id || !name || !email) throw new Error(missingArguments.payload);

    const values = [id, name, email, 'email'];
    const queryStr = `
      INSERT INTO users (id, name, email, preferred_contact_mode)
        VALUES ($1, $2, $3, $4)
      RETURNING *;`;
    const response = await pool.query(queryStr, values);
    return { ok: true, payload: response.rows[0] };

  } catch (error) {
    // console.log('[USER MODEL] - createUser err', error.message);
    return { ok: false, payload: error.message };
  }
};


exports.updateUser = async (userid, user) => {
  try {
    const userUpdatesOwnData = await isUserDataOwner(userid, user);

    if (userUpdatesOwnData) {
      const { name, email, phone, preferred_contact_mode } = user;

      if (!name || !email || !preferred_contact_mode) throw new Error(missingArguments.payload);
      if (preferred_contact_mode === 'phone' && !phone) throw new Error(missingArguments.payload);

      const values = [name, email, phone, preferred_contact_mode, userid];
      const queryStr = `
        UPDATE users
          SET name = $1, email = $2, phone = $3, preferred_contact_mode = $4
        WHERE id = $5
        RETURNING *`;

      const response = await pool.query(queryStr, values);
      return { ok: true, payload: response.rows[0] };

    }
    else {
      throw new Error(notAllowed.payload);
    }

  } catch (error) {
    // console.log('[USER MODEL] - updateUser err]', error.message);
    return { ok: false, payload: error.message };
  }
};


///////////////:





exports.fetchUserDataCustom = async userid => {
  try {
    const userIdIsValid = isUserIdValid(userid);
    if (!userIdIsValid) throw new Error(errorMessages.notAllowed);

    const userDetailsResponse = await fetchUserData(userid);
    if (!userDetailsResponse.ok) throw new Error(userDetailsResponse.payload);
    const userDetails = userDetailsResponse.payload;

    const userGroupsResponse = await fetchGroupsUserIsMemberOf(userid);
    if (!userGroupsResponse.ok) throw new Error(userGroupsResponse.payload);
    const userGroups = userGroupsResponse.payload;

    const userOrdersResponse = await fetchUserOrders(userid);
    if (!userOrdersResponse.ok) throw new Error(userOrdersResponse.payload);
    const userOrders = userOrdersResponse.payload;

    return {
      ok: true,
      payload: { userDetails, userGroups, userOrders }
    };

  } catch (error) {
    // console.log('[USER MODEL] - fetchUserDataCustom error', error.message);
    return { ok: false, payload: error.message };
  }
};
