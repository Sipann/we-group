'use strict';

const Router = require('koa-router');
const router = new Router();

const controllers = require('./controllers');

// router.get('/groups', controllers.groupCtrl.getUserGroups); //! EXTRACTED

router.get('/groups/search', controllers.groupCtrl.searchGroups);     // CALLED
router.put('/groups', controllers.groupCtrl.updateGroupInfos);  // CALLED

// router.put('/groups/infos/:groupid', controllers.groupCtrl.updateGroupInfos);  //! NOT FOUND
// router.put('/groups/deadline/:groupid', controllers.groupCtrl.updateGroupDeadline);  //! NOT FOUND
// router.get('/groups/detail/:groupid', controllers.groupCtrl.getGroup);  //! NOT FOUND
// router.get('/groups/manage/:groupid/items', controllers.groupCtrl.getGroupItems);  //! NOT FOUND
// router.get('/groups/manage/:groupid/members', controllers.groupCtrl.getGroupUsers);  //! NOT FOUND
// router.get('/groups/manage/:groupid/order/:deadline', controllers.groupCtrl.getGroupOrder);  //! NOT FOUND


router.post('/groups/user/:groupid', controllers.groupCtrl.addUserToGroup);  // CALLED

// router.get('/groups/orders/:groupid', controllers.groupCtrl.fetchGroupOrder);  //! NOT FOUND
router.get('/groups/members/:groupid', controllers.groupCtrl.fetchGroupMembers);  // CALLED
router.get('/groups/items/:groupid', controllers.itemCtrl.fetchGroupItems); //? FOUND BUT ACTION CALLED?

router.post('/groups', controllers.groupCtrl.createGroup);  // CALLED

router.delete('/groups/items/:itemid', controllers.itemCtrl.deleteItem); //TODO FOUND

router.get('/orders/group/:groupid', controllers.groupCtrl.fetchGroupOrders);  // CALLED
router.get('/orders/user', controllers.orderCtrl.fetchUserOrders);  // CALLED


router.post('/orders/:groupid', controllers.orderCtrl.createOrder); //? FOUND BUT ACTION CALLED?
// router.get('/orders', controllers.orderCtrl.getAllOrdersForUser);  //! NOT FOUND
router.get('/orders/:groupid', controllers.orderCtrl.fetchOrderGroupUser);  //? FOUND BUT ACTION CALLED?
router.put('/orders', controllers.orderCtrl.updateOrder);  //? FOUND BUT ACTION CALLED?

router.post('/users', controllers.userCtrl.createUser);  // CALLED
router.get('/users', controllers.userCtrl.getUser);  //? FOUND BUT ACTION CALLED?
router.put('/users', controllers.userCtrl.updateUser);  // CALLED
// router.delete('/users', controllers.userCtrl.deleteUser);  //! NOT FOUND

//

// router.get('/user', controllers.userCtrl.fetchUserData); //! NOT FOUND

// TESTS
router.post('/groups/orders/new/:groupid', controllers.groupCtrl.createNewGroupOrder);  // CALLED
router.get('/test/groups/orders/:groupid', controllers.groupCtrl.fetchGroupFullAvailableOrders);   // CALLED
router.post('/groups/orders/items/:orderid', controllers.groupCtrl.addNewItemToOrder);  // CALLED
// router.post('/test/groups/orders/items/:orderid/add', controllers.groupCtrl.addExistingItemToOrder);  // CALLED
router.post('/groups/orders/items/:orderid/add', controllers.groupCtrl.addExistingItemToOrder);  // CALLED
router.get('/test/user', controllers.userCtrl.fetchUserDataCustom);   // CALLED

router.post('/test/orders/:availableorderid', controllers.orderCtrl.placeOrder);  // CALLED

// EXTRACTED
// router.get('/test/groups/')
// router.get('/groups/search/:userid', controllers.groupCtrl.searchGroupsForUser);
// router.get('/groups/manage/:groupid/items', controllers.itemCtrl.fetchGroupItems);


// router.post('/test/items', controllers.itemCtrl.setAvailableGroupItem);  //! NOT FOUND
// router.post('/groups/items', controllers.itemCtrl.addItemToGroup); //!EXTRACTED

// For Tests
// router.delete('/tests/groups', controllers.testsCtrl.deleteGroups);
router.delete('/tests/groups/:groupname', controllers.testsCtrl.deleteGroup);
router.get('/tests/users/owngroups', controllers.testsCtrl.fetchGroupsUserIsMemberOf);
router.delete('/tests/users/:userid', controllers.testsCtrl.deleteUser);
router.get('/tests/groups/:groupname', controllers.testsCtrl.getGroupByName);
router.get('/tests/groupsusers/lastadded', controllers.testsCtrl.getLastGroupsUsersAdded);
router.get('/tests/availableorders/first', controllers.testsCtrl.getFirstAvailableOrder);
router.get('/tests/availableorders/lastadded', controllers.testsCtrl.getLastAvailableOrderAdded);
router.get('/tests/availableorders/group/:groupid', controllers.testsCtrl.getGroupAvailableOrders);
router.get('/tests/items/lastInserted', controllers.testsCtrl.lastInsertedItem);
router.get('/tests/items/:groupid', controllers.testsCtrl.getGroupItems);
router.get('/tests/availableitems/lastInserted', controllers.testsCtrl.lastInsertedAvailableItem);
router.get('/tests/availableOrders/:groupid', controllers.testsCtrl.fetchGroupAvailableOrders);
router.get('/tests/availableOrdersItems/:orderid', controllers.testsCtrl.fetchAvailableOrderItems);
router.get('/tests/user/:userid', controllers.testsCtrl.fetchUserData);

router.delete('/tests/items/:itemid', controllers.testsCtrl.deleteItemRow);
router.delete('/tests/availableitems/:availableitemid', controllers.testsCtrl.deleteAvailableItemRow);

router.delete('/tests/availableorders/:availableorderid', controllers.testsCtrl.deleteAvailableOrderRow);
router.delete('/tests/groupsusers/:groupsusersid', controllers.testsCtrl.deleteGroupsUsersRow);

module.exports = router;