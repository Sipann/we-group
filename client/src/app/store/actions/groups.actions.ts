import { Action, createAction, props } from '@ngrx/store';

import { Group } from '../../models/group.model';
import { Item } from '../../models/item.model';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { ItemInput } from '../../models/item-input.model';


export enum GroupsActionsTypes {

  AddItem = '[Groups] Add Item',
  ItemAdded = '[Groups] Item Added',

  DeleteItem = '[Groups] Delete Item',
  ItemDeleted = '[Groups] Item Deleted',

  FetchGroupSummary = '[Groups] Fetch Group Summary',
  GroupSummaryFetched = '[Groups] Group Summary Fetched',

  FetchGroupMembers = '[Groups] Fetch Group Members',
  GroupMembersFetched = '[Groups] Group Members Fetched',

  FetchGroupItems = '[Groups] Fetch Group Items',
  GroupItemsFetched = '[Groups] Group Items Fetched',

  LoadGroups = '[Groups] Load',
  GroupsLoaded = '[Groups] Data Loaded',
  SelectGroup = '[Groups] Select',

  CreateGroup = '[Groups] Create',
  GroupCreated = '[Groups] Group Created',

  DeleteGroup = '[Groups] Delete',
  GroupDeleted = '[Groups] Group Deleted',

  UpdateGroup = '[Groups] Update',
  GroupUpdated = '[Groups] Group Updated',

  ResetCreateGroup = '[Groups] Reset Create Group Modal',
  ResetAddItemModal = '[Groups] Reset Add Item Modal',
};


export class FetchGroupSummary implements Action {
  readonly type = GroupsActionsTypes.FetchGroupSummary;
  constructor(public payload: number) { }
};

export class GroupSummaryFetched implements Action {
  readonly type = GroupsActionsTypes.GroupSummaryFetched;
  constructor(private payload: {
    groupid: number,
    orders: { username: string, itemname: string, orderedquantity: number }[]
  }) { }
}

export class FetchGroupMembers implements Action {
  readonly type = GroupsActionsTypes.FetchGroupMembers;
  constructor(public payload: number) { }
};

export class GroupMembersFetched implements Action {
  readonly type = GroupsActionsTypes.GroupMembersFetched;
  constructor(private payload: { members: { name: string, id: string }[], groupid: number }) { }
};


















export class LoadGroups implements Action {
  readonly type = GroupsActionsTypes.LoadGroups;
  constructor(private payload: string) { }         // Added for user uid
};

export class GroupsLoaded implements Action {
  readonly type = GroupsActionsTypes.GroupsLoaded;
  constructor(private payload: Group[]) { }
};

export class SelectGroup implements Action {
  readonly type = GroupsActionsTypes.SelectGroup;
  constructor(private payload: { groupid: number }) { }
};

export class CreateGroup implements Action {
  readonly type = GroupsActionsTypes.CreateGroup;
  constructor(public payload: Group) { }        // Group or GroupInput?
};

export class GroupCreated implements Action {
  readonly type = GroupsActionsTypes.GroupCreated;
  constructor(private payload: Group) { }
}

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

export class FetchGroupItems implements Action {
  readonly type = GroupsActionsTypes.FetchGroupItems;
  constructor(public payload: { groupid: string }) { }
};

export class GroupItemsFetched implements Action {
  readonly type = GroupsActionsTypes.GroupItemsFetched;
  constructor(private payload: { groupid: string, items: Item[] }) { }
};

export class GroupUpdated implements Action {
  readonly type = GroupsActionsTypes.GroupUpdated;
  constructor(private payload: Group) { }
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

export class UpdateGroup implements Action {
  readonly type = GroupsActionsTypes.UpdateGroup;
  constructor(public payload: Group) { }
};




export type GroupsActions = AddItem |
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
  FetchGroupSummary |
  GroupSummaryFetched |

  ResetCreateGroup
  ;
