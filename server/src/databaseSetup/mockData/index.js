'use strict';

import { mockUsers } from './mockUsers';
import { mockGroups } from './mockGroups';
import { mockGroupsUsers } from './mockGroupsUsers';
import { mockAvailableOrders } from './mockAvailableOrders';
import { mockItems } from './mockItems';
import { mockAvailableItems } from './mockAvailableItems';
import { mockPlacedOrders } from './mockPlacedOrders';
import { mockOrderedItems } from './mockOrderedItems';


(async function dropTables () {

  await mockUsers();
  await mockGroups();
  await mockGroupsUsers();
  await mockAvailableOrders();
  await mockItems();
  await mockAvailableItems();
  await mockPlacedOrders();
  await mockOrderedItems();

}())