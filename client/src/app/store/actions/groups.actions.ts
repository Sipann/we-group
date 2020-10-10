import { Action, createAction, props } from '@ngrx/store';

import { Group } from '../../models/group.model';
import { GroupInput } from 'src/app/models/group-input.model';
import { Item } from '../../models/item.model';
import { GroupOrderAvailable } from 'src/app/models/group-order-available.model';
import { Member } from '../../models/member.model';


export enum GroupsActionsTypes {

  AddMemberToGroup = '[Groups] Add Member To Group',
  MemberAddedToGroup = '[Groups] Member Added To Group',

  FetchOtherGroups = '[Groups] Fetch Other Groups',
  OtherGroupsFetched = '[Groups] Other Groups Fetched',

  AddItem = '[Groups] Add Item',
  ItemAdded = '[Groups] Item Added',

  // Add New Item to Group and Order (create && add)
  AddNewItem = '[Groups] Add New Item',
  NewItemAdded = '[Groups] New Item Added',

  // Add Existing Group Item to an Order
  AddItemToOrder = '[Groups] Add Item To Order',
  ItemAddedToOrder = '[Group] Item Added To Order',

  DeleteItem = '[Groups] Delete Item',
  ItemDeleted = '[Groups] Item Deleted',

  FetchGroupOrders = '[Groups] Fetch Group Orders',
  GroupOrdersFetched = '[Groups] GroupOrders Fetched',

  FetchGroupMembers = '[Groups] Fetch Group Members',
  GroupMembersFetched = '[Groups] Group Members Fetched',

  FetchGroupItems = '[Groups] Fetch Group Items',
  GroupItemsFetched = '[Groups] Group Items Fetched',

  FetchGroupAvailableItems = '[Groups] Fetch Group Available Items',
  GroupAvailableItemsFetched = '[Groups] Group Available Items Fetched',

  LoadGroups = '[Groups] Load',
  GroupsLoaded = '[Groups] Data Loaded',
  SelectGroup = '[Groups] Select',

  CreateGroup = '[Groups] Create',
  GroupCreated = '[Groups] Group Created',
  CreateGroupFail = '[Groups] Create Group Fail',

  DeleteGroup = '[Groups] Delete',
  GroupDeleted = '[Groups] Group Deleted',

  UpdateGroup = '[Groups] Update',
  GroupUpdated = '[Groups] Group Updated',

  ResetCreateGroup = '[Groups] Reset Create Group Modal',
  ResetAddItemModal = '[Groups] Reset Add Item Modal',

  CreateNewGroupOrder = '[Groups] Create New Group Order',
  NewGroupOrderCreated = '[Groups] New Group Order Created',

  FetchGroupAvailableOrders = '[Groups] Fetch Group Available Orders',
  GroupAvailableOrdersFetched = '[Groups] Group Available Orders Fetched',

  FetchGroupAvailableOrderItems = '[Groups] Fetch Group Available Order Items',
  GroupAvailableOrderItemsFetched = '[Groups] Group Available Order Items Fetched',

  RemoveMemberFromGroup = '[Groups] Remove Member From Group',
  MemberRemovedFromGroup = '[Groups] Member Removed From Group',
};










export class FetchGroupAvailableOrderItems implements Action {
  readonly type = GroupsActionsTypes.FetchGroupAvailableOrderItems;
  constructor(public payload: { orderid: string }) { }
};

export class GroupAvailableOrderItemsFetched implements Action {
  readonly type = GroupsActionsTypes.GroupAvailableOrderItemsFetched;
  constructor() { }
}



export class GroupAvailableOrdersFetched implements Action {
  readonly type = GroupsActionsTypes.GroupAvailableOrdersFetched;
  constructor() { }
};






export class LoadGroups implements Action {
  readonly type = GroupsActionsTypes.LoadGroups;
  constructor(private payload: string) { }         // Added for user uid
};

export class SelectGroup implements Action {
  readonly type = GroupsActionsTypes.SelectGroup;
  constructor(private payload: { groupid: number }) { }
};





export class DeleteGroup implements Action {
  readonly type = GroupsActionsTypes.DeleteGroup;
  constructor(public payload: Group) { }        // Group or GroupInput?
};

export class GroupDeleted implements Action {
  readonly type = GroupsActionsTypes.GroupDeleted;
  constructor(private payload: Group) { }
}






//

export class AddItem implements Action {
  readonly type = GroupsActionsTypes.AddItem;
  constructor(public payload: { item: Item, groupid: string }) { }
};





export class DeleteItem implements Action {
  readonly type = GroupsActionsTypes.DeleteItem;
  constructor(public payload: { itemid: string, groupid: string }) { }
};

export class FetchGroupAvailableItems implements Action {
  readonly type = GroupsActionsTypes.FetchGroupAvailableItems;
  constructor(public payload: { groupid: string }) { }
}

export class FetchGroupItems implements Action {
  readonly type = GroupsActionsTypes.FetchGroupItems;
  constructor(public payload: { groupid: string }) { }
};







export class GroupItemsFetched implements Action {
  readonly type = GroupsActionsTypes.GroupItemsFetched;
  constructor(private payload: { groupid: string, items: Item[] }) { }
};





export class ItemAdded implements Action {
  readonly type = GroupsActionsTypes.ItemAdded;
  constructor(private payload: { item: Item, groupid: string }) { }
};

export class ItemDeleted implements Action {
  readonly type = GroupsActionsTypes.ItemDeleted;
  constructor(private payload: { itemid: string, groupid: string }) { }
};





export class ResetAddItemModal implements Action {
  readonly type = GroupsActionsTypes.ResetAddItemModal;
};

export class ResetCreateGroup implements Action {
  readonly type = GroupsActionsTypes.ResetCreateGroup;
};




/////////////////////////////////////
// CALLED

export class AddItemToOrder implements Action {
  readonly type = GroupsActionsTypes.AddItemToOrder;
  constructor(public payload: { groupid: string, orderid: string, itemData }) { }  //TODO typescript
};

export class AddMemberToGroup implements Action {
  readonly type = GroupsActionsTypes.AddMemberToGroup;
  constructor(public payload: { groupid: string }) { }
};

export class AddNewItem implements Action {
  readonly type = GroupsActionsTypes.AddNewItem;
  constructor(public payload: { groupid: string, orderid: string, item }) { }
};


export class CreateGroup implements Action {
  readonly type = GroupsActionsTypes.CreateGroup;
  constructor(public payload: GroupInput) { }
};

export class CreateGroupFail implements Action {
  readonly type = GroupsActionsTypes.CreateGroupFail;
  constructor(private payload) { }
}

export class CreateNewGroupOrder implements Action {
  readonly type = GroupsActionsTypes.CreateNewGroupOrder;
  constructor(public payload: { groupid: string, newOrder: { deadlineTs: string, deliveryTs: string } }) { }
};

export class FetchGroupMembers implements Action {
  readonly type = GroupsActionsTypes.FetchGroupMembers;
  constructor(public payload: { groupid: string }) { }
};


export class FetchGroupOrders implements Action {
  readonly type = GroupsActionsTypes.FetchGroupOrders;
  constructor(public payload: { groupid: string }) { }
};


export class FetchOtherGroups implements Action {
  readonly type = GroupsActionsTypes.FetchOtherGroups;
};

export class GroupCreated implements Action {
  readonly type = GroupsActionsTypes.GroupCreated;
  constructor(private payload: Group) { }
};


export class GroupsLoaded implements Action {
  readonly type = GroupsActionsTypes.GroupsLoaded;
  constructor(private payload: Group[]) { }
};


export class GroupMembersFetched implements Action {
  readonly type = GroupsActionsTypes.GroupMembersFetched;
  constructor(private payload: { groupid: string, members: Member[] }) { }
};


export class GroupOrdersFetched implements Action {
  readonly type = GroupsActionsTypes.GroupOrdersFetched;
  constructor(private payload) { };
};


export class GroupUpdated implements Action {
  readonly type = GroupsActionsTypes.GroupUpdated;
  constructor(private payload: Group) { }
};

export class FetchGroupAvailableOrders implements Action {
  readonly type = GroupsActionsTypes.FetchGroupAvailableOrders;
  constructor(public payload: { groupid: string }) { }
};

export class GroupAvailableItemsFetched implements Action {
  readonly type = GroupsActionsTypes.GroupAvailableItemsFetched;
  constructor(private payload) { }   //TODO typescript
};

export class ItemAddedToOrder implements Action {
  readonly type = GroupsActionsTypes.ItemAddedToOrder;
  constructor(private payload: { groupid: string, orderid: string, item }) { } //TODO typescript
};

export class MemberAddedToGroup implements Action {
  readonly type = GroupsActionsTypes.MemberAddedToGroup;
  constructor(private payload: Group) { }
};

export class NewGroupOrderCreated implements Action {
  readonly type = GroupsActionsTypes.NewGroupOrderCreated;
  constructor(private payload: GroupOrderAvailable) { }
};

export class NewItemAdded implements Action {
  readonly type = GroupsActionsTypes.NewItemAdded;
  constructor(private payload: { groupid: string, orderid: string, item }) { }
};

export class OtherGroupsFetched implements Action {
  readonly type = GroupsActionsTypes.OtherGroupsFetched;
  constructor(private payload: Group[]) { }
};

export class UpdateGroup implements Action {
  readonly type = GroupsActionsTypes.UpdateGroup;
  constructor(public payload: Group) { }
};

export class RemoveMemberFromGroup implements Action {
  readonly type = GroupsActionsTypes.RemoveMemberFromGroup;
  constructor(public payload: { groupid: string, removedUserid: string }) { }
}

export class MemberRemovedFromGroup implements Action {
  readonly type = GroupsActionsTypes.MemberRemovedFromGroup;
  constructor(private payload: { groupid: string, removedUserid: string }) { }
}


///////////////////////////////////////
// EXTRACTED


export type GroupsActions = AddItem |
  AddMemberToGroup |
  MemberAddedToGroup |
  ItemAdded |
  LoadGroups |
  GroupsLoaded |
  SelectGroup |
  CreateGroup |
  GroupCreated |
  DeleteGroup |
  GroupDeleted |
  UpdateGroup |
  GroupUpdated |
  FetchGroupItems |
  GroupItemsFetched |
  ResetAddItemModal |
  DeleteItem |
  ItemDeleted |
  FetchGroupMembers |
  GroupMembersFetched |
  FetchGroupOrders |
  GroupOrdersFetched |
  FetchOtherGroups |
  OtherGroupsFetched |
  FetchGroupAvailableItems |
  GroupAvailableItemsFetched |
  CreateNewGroupOrder |
  NewGroupOrderCreated |
  CreateGroupFail |
  FetchGroupAvailableOrders |
  GroupAvailableOrdersFetched |

  FetchGroupAvailableOrderItems |
  GroupAvailableOrderItemsFetched |

  AddNewItem |
  NewItemAdded |

  AddItemToOrder |
  ItemAddedToOrder |

  ResetCreateGroup |

  RemoveMemberFromGroup |
  MemberRemovedFromGroup
  ;
