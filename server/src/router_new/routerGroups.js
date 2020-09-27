'use strict';

// import * as Router from 'koa-router';
import Router from 'koa-router';
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
} from '../controllers/groupCtrl';


router.delete('/available-order/:availableorderid', CtrlDeleteGroupAvailableOrder);
router.delete('/remove-self/:groupid', CtrlRemoveSelfFromGroup);
router.delete('/remove-member/:groupid', CtrlRemoveMemberFromGroup);
router.delete('/:groupid', CtrlDeleteGroup);

router.get('/members/:groupid', CtrlFetchGroupMembers);
router.get('/search', CtrlSearchGroups);
router.get('/available-orders/:groupid', CtrlFetchGroupFullAvailableOrders);

router.post('/', CtrlCreateGroup);
router.post('/available-order/existing-item/:orderid', CtrlAddExistingItemToAvailableOrder);
router.post('/available-order/new-item/:orderid', CtrlAddNewItemToAvailableOrder);
router.post('/available-order/:groupid', CtrlCreateNewGroupOrder);

router.post('/user/:groupid', CtrlAddUserToGroup);

router.put('/', CtrlUpdateGroupInfos);
router.put('/group-manager/:groupid', CtrlChangeGroupManager);
router.put('/available-order/infos/:orderid', CtrlUpdateAvailableOrderInfos);

export { router as groupsRouter };