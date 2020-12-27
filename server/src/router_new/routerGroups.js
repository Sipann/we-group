'use strict';

import * as Router from 'koa-router';
// import Router from 'koa-router';
const router = new Router({
  prefix: '/groups'
});

import {
  CtrlFetchGroupFullAvailableOrders,
  CtrlAddNewItemToAvailableOrder,
  CtrlAddExistingItemToAvailableOrder,
  CtrlAddUserToGroup,
  CtrlCreateGroup,
  CtrlCreateNewGroupOrder,
  CtrlFetchGroupMembers,
  CtrlSearchGroups,
  CtrlUpdateGroupInfos,
  CtrlChangeGroupManager,
  CtrlUpdateAvailableOrderInfos,
  CtrlDeleteGroupAvailableOrder,
  CtrlDeleteGroup,
  CtrlRemoveSelfFromGroup,
  CtrlRemoveMemberFromGroup,
  CtrlFetchStaticManageGroupData,
} from '../controllers/groupCtrl';


router.delete('/available-order/:availableorderid', CtrlDeleteGroupAvailableOrder);
router.delete('/remove-self/:groupid', CtrlRemoveSelfFromGroup);
router.delete('/:groupid', CtrlDeleteGroup);

router.get('/members/:groupid', CtrlFetchGroupMembers);
router.get('/search', CtrlSearchGroups);
router.get('/available-orders/:groupid', CtrlFetchGroupFullAvailableOrders);
router.get('/manage/:groupid', CtrlFetchStaticManageGroupData);

router.post('/', CtrlCreateGroup);
router.post('/available-order/existing-item/:orderid', CtrlAddExistingItemToAvailableOrder);
router.post('/available-order/new-item/:orderid', CtrlAddNewItemToAvailableOrder);
router.post('/available-order/:groupid', CtrlCreateNewGroupOrder);

router.post('/user/:groupid', CtrlAddUserToGroup);

router.put('/', CtrlUpdateGroupInfos);
router.put('/group-manager/:groupid', CtrlChangeGroupManager);
router.put('/available-order/infos/:orderid', CtrlUpdateAvailableOrderInfos);
router.put('/remove-member/:groupid', CtrlRemoveMemberFromGroup);

export { router as groupsRouter };