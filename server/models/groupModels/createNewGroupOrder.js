'use strict';

import pool from '../index';
import { DBIsUserGroupManager, DBDoesAvailableOrderExist } from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function createNewGroupOrder (userid, groupid, newAvailableOrder) {
  try {

    if (!userid) throw new Error(errorMessages.notAllowed);

    if (!newAvailableOrder || !newAvailableOrder.deadlineTs || !newAvailableOrder.deliveryTs) {
      throw new Error(errorMessages.missingArguments);
    }

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupid);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    const { deliveryTs, deadlineTs } = newAvailableOrder;
    const values = [groupid, deliveryTs, deadlineTs];

    const orderAlreadyExists = await DBDoesAvailableOrderExist(groupid, deliveryTs, deadlineTs);
    if (orderAlreadyExists.ok && orderAlreadyExists.payload) throw new Error(errorMessages.unnecessary);
    // console.log('CREATE NEW ORDER EXISTS ? =>', orderAlreadyExists);

    const queryStr = `
      INSERT INTO available_orders (group_id, delivery_ts, deadline_ts)
        VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const response = await pool.query(queryStr, values);
    if (response.rows?.length) return { ok: true, payload: response.rows[0] };
    else throw new Error(errorMessages.internalServerError);

  } catch (error) {
    return handleErrorModel(error);
  }
};