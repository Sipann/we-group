'use strict';

// import * as Router from 'koa-router';
import Router from 'koa-router';
const router = new Router({
  prefix: '/tests'
});

import {
  CtrlDeleteGroupById,
  CtrlDeleteUserById,
  CtrlDeleteAvailableOrderById,
  CtrlGetAvailableItemById,
  CtrlGetAvailableOrderById,
  CtrlGetGroupById,
  CtrlGetItemById,
  CtrlDeleteGroupsUsersRow,
  CtrlGetGroupsUsersRow,
  CtrlGetUserById,
  CtrlGetFirstAvailableOrder,
  CtrlDeleteItemById,
  CtrlDeleteAvailableItemById,
  CtrlGetAvailableItemLastInserted,
  CtrlAreAddAvailableItemArgsValid,
  CtrlGetOrderedItem,
  CtrlGetPlacedOrderById,
  CtrlDeletePlacedOrderById,
  CtrlDeleteOrderedItemById,
  CtrlPutAvailableItemById,
  CtrlPutGroupManagerId,
  CtrlReinsertUser,
} from '../controllers/testsCtrl';

import {
  CtrlReturnAddedItem,
  CtrlFetchGroupAvailableOrders,
  CtrlFetchAvailableOrderItems,
  CtrlFetchGroupsUserIsMemberOf,
  CtrlFetchUserData,
  CtrlFetchUserPlacedOrders,
  CtrlGetLightGroupMembers,
  CtrlIsAvailableOrderIdValid,
  CtrlIsGroupIdValid,
  CtrlIsPlacedOrderIdValid,
  CtrlIsUserDataOwner,
  CtrlIsUserGroupManager,
  CtrlIsUserGroupMember,
  CtrlIsUserIdValid,
  CtrlDoesAvailableOrderExist,
  CtrlIsPlacedOrderEditable,
  CtrlIsAvailableOrderEditable,
  CtrlIsGroupActive,
  CtrlGetGroupByName,
  CtrlIsGroupDeletable,
  CtrlIsUserRemovable,
  CtrlIsUserDeletable,
} from '../controllers/utilsCtrl';


router.get('/available-order-items/:availableorderid', CtrlFetchAvailableOrderItems);
router.get('/available-orders/:groupid', CtrlFetchGroupAvailableOrders);
router.get('/get-light-group-members/:groupid', CtrlGetLightGroupMembers);
router.get('/is-available-order-id-valid/:availableorderid', CtrlIsAvailableOrderIdValid);
router.get('/is-group_id_valid/:groupid', CtrlIsGroupIdValid);
router.get('/is-group-active/:groupid', CtrlIsGroupActive);
router.get('/is-group-deletable/:groupid', CtrlIsGroupDeletable);
router.get('/is-available-order-editable/:availableorderid', CtrlIsAvailableOrderEditable);
router.get('/is-placed-order-id-valid/:placedorderid', CtrlIsPlacedOrderIdValid);
router.get('/is-placed-order-editable/:placedorderid', CtrlIsPlacedOrderEditable);
router.get('/is-user-group-manager/:userid/:groupid', CtrlIsUserGroupManager);
router.get('/is-user-group-member/:userid/:groupid', CtrlIsUserGroupMember);
router.get('/is-user-id-valid/:userid', CtrlIsUserIdValid);
router.get('/is-user-removable/:groupid/:userid', CtrlIsUserRemovable);
router.get('/is-user-deletable', CtrlIsUserDeletable);
router.get('/are-add-available-item-args-valid/:userid/:orderid', CtrlAreAddAvailableItemArgsValid);
router.get('/return-added-item/:itemid/:availableorderid', CtrlReturnAddedItem);

router.get('/items/:itemid', CtrlGetItemById);
router.get('/available-item/last-inserted', CtrlGetAvailableItemLastInserted);
router.get('/available-item/:availableitemid', CtrlGetAvailableItemById);

router.get('/first-available-order', CtrlGetFirstAvailableOrder);
router.get('/available-order/:availableorderid', CtrlGetAvailableOrderById);
router.get('/fetch-groups-user-is-member-of', CtrlFetchGroupsUserIsMemberOf);
router.get('/fetch-user-data/:userid', CtrlFetchUserData);
router.get('/user/:userid', CtrlGetUserById);
router.get('/group/:groupid', CtrlGetGroupById);
router.get('/groupsusers/:groupid/:userid', CtrlGetGroupsUsersRow);
// router.get('/ordered-item/:ordereditemid', CtrlGetOrderedItemById);
router.get('/ordered-item/:placedorderid/:itemid', CtrlGetOrderedItem);
router.get('/placed-orders/:placedorderid', CtrlGetPlacedOrderById)
router.get('/get-group-by-name/:groupname', CtrlGetGroupByName);
router.get('/fetch-user-placed-orders/:userid', CtrlFetchUserPlacedOrders);

router.delete('/items/:itemid', CtrlDeleteItemById);
// router.delete('/available-item/last-inserted', CtrlDeleteAvailableItemLastInserted);
router.delete('/available-item/:availableitemid', CtrlDeleteAvailableItemById);
router.delete('/available-order/:availableorderid', CtrlDeleteAvailableOrderById);
router.delete('/user/:userid', CtrlDeleteUserById);
router.delete('/group/:groupid', CtrlDeleteGroupById);
router.delete('/groupsusers/:groupid/:userid', CtrlDeleteGroupsUsersRow);
router.delete('/placed-orders/:placedorderid', CtrlDeletePlacedOrderById);
router.delete('/ordered-item/:ordereditemid', CtrlDeleteOrderedItemById);

router.post('/does-available-order-exist', CtrlDoesAvailableOrderExist);
router.post('/is-user-data-owner/:userid', CtrlIsUserDataOwner);

router.put('/available-item/:availableitemid/:remainingqty', CtrlPutAvailableItemById);
router.put('/group-manager-id/:groupid/:managerid', CtrlPutGroupManagerId);
router.put('reinsert-user', CtrlReinsertUser);

export { router as testsRouter };