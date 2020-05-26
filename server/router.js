'use strict';

const Router = require('koa-router');
const router = new Router();

const controllers = require('./controllers');

router.get('/groups', controllers.groupCtrl.getUserGroups);

router.get('/groups/search', controllers.groupCtrl.searchGroups);
// router.get('/groups/search/:userid', controllers.groupCtrl.searchGroupsForUser);

//
router.put('/groups', controllers.groupCtrl.updateGroup);
//

router.put('/groups/infos/:groupid', controllers.groupCtrl.updateGroupInfos);
router.put('/groups/deadline/:groupid', controllers.groupCtrl.updateGroupDeadline);
router.get('/groups/detail/:groupid', controllers.groupCtrl.getGroup);
//
router.get('/groups/manage/:groupid/items', controllers.groupCtrl.getGroupItems);
// router.get('/groups/manage/:groupid/items', controllers.itemCtrl.fetchGroupItems);
//
router.get('/groups/manage/:groupid/members', controllers.groupCtrl.getGroupUsers);


router.get('/groups/manage/:groupid/order/:deadline', controllers.groupCtrl.getGroupOrder);


router.post('/groups/user/:groupid', controllers.groupCtrl.addUserToGroup);
//
router.get('/groups/orders/:groupid', controllers.groupCtrl.fetchGroupOrder);
router.get('/groups/members/:groupid', controllers.userCtrl.fetchGroupMembers);
router.get('/groups/items/:groupid', controllers.itemCtrl.fetchGroupItems);
//
router.post('/groups/items', controllers.itemCtrl.addItemToGroup);
router.post('/groups', controllers.groupCtrl.createGroup);

router.delete('/groups/items/:itemid', controllers.itemCtrl.deleteItem);



router.post('/orders/:groupid', controllers.orderCtrl.createOrder);
router.get('/orders', controllers.orderCtrl.getAllOrdersForUser);
router.get('/orders/:groupid', controllers.orderCtrl.fetchOrderGroupUser);
router.put('/orders', controllers.orderCtrl.updateOrder);

router.post('/users', controllers.userCtrl.createUser);
router.get('/users', controllers.userCtrl.getUser);
router.put('/users', controllers.userCtrl.updateUser);
router.delete('/users', controllers.userCtrl.deleteUser);


router.get('/user', controllers.userCtrl.fetchUserData);

module.exports = router;