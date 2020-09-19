'use strict';

import { DBDeletePlacedOrder, DBFetchPlacedOrder, } from '../../models/orderModels';
import {
  DBIsPlacedOrderIdValid,
  DBIsUserIdValid,
  DBDoesUserOwnPlacedOrder,
  DBFetchPlacedOrderItems,
  DBIsPlacedOrderEditable,
} from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function deletePlacedOrder (ctx) {
  try {
    const { placedorderid } = ctx.params;
    const { userid } = ctx.request.header;

    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const isPlacedOrderIdValid = await DBIsPlacedOrderIdValid(placedorderid);
    if (!isPlacedOrderIdValid.ok || !isPlacedOrderIdValid.payload) throw new Error(errorMessages.invalidInput);

    const userOwnsPlacedOrder = await DBDoesUserOwnPlacedOrder(userid, placedorderid);
    if (!userOwnsPlacedOrder.ok || !userOwnsPlacedOrder.payload) throw new Error(errorMessages.notAllowed);

    const isPlacedOrderEditable = await DBIsPlacedOrderEditable(placedorderid);
    if (!isPlacedOrderEditable.ok || !isPlacedOrderEditable.payload) throw new Error(errorMessages.notAllowed);


    // GET DETAILS ABOUT ORDERED ITEMS
    const orderedItemsResponse = await DBFetchPlacedOrderItems(placedorderid);
    if (!orderedItemsResponse.ok) throw new Error(orderedItemsResponse.payload);
    const orderedItems = orderedItemsResponse.payload;
    const response = await DBDeletePlacedOrder(placedorderid, orderedItems);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}