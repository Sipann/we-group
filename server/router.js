'use strict';

const Router = require('koa-router');
const router = new Router();

const controllers = require('./controllers');

router.get('/groups', controllers.groupCtrl.getUserGroups);
router.put('/groups/infos/:groupid', controllers.groupCtrl.updateGroupInfos);
router.put('/groups/deadline/:groupid', controllers.groupCtrl.updateGroupDeadline);
router.get('/groups/detail/:groupid', controllers.groupCtrl.getGroup);
router.get('/groups/manage/:groupid/items', controllers.groupCtrl.getGroupItems);
router.get('/groups/manage/:groupid/members', controllers.groupCtrl.getGroupUsers);
router.get('/groups/manage/:groupid/order/:deadline', controllers.groupCtrl.getGroupOrder);
router.post('/groups', controllers.groupCtrl.createGroup);
router.post('/groups/items', controllers.itemCtrl.addItemToGroup);
router.delete('/groups/items/:itemid', controllers.itemCtrl.deleteItem);
router.post('/orders/:groupid', controllers.orderCtrl.createOrder);
router.get('/orders', controllers.orderCtrl.getAllOrdersForUser);
router.post('/users', controllers.userCtrl.createUser);


module.exports = router;