import { Action, createAction, props } from '@ngrx/store';

import { Group } from '../../models/group.model';
import { Item } from '../../models/item.model';
import { ItemInput } from '../../models/item-input.model';


export enum GroupsActionsTypes {

  AddItem = '[Groups] Add Item',
  ItemAdded = '[Groups] Item Added',

  DeleteItem = '[Groups] Delete Item',
  ItemDeleted = '[Groups] Item Deleted',

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


export class DeleteItem implements Action {
  readonly type = GroupsActionsTypes.DeleteItem;
  constructor(public payload: { itemid: number, groupid: number }) { }
};

export class ItemDeleted implements Action {
  readonly type = GroupsActionsTypes.ItemDeleted;
  constructor(private payload: { itemid: number, groupid: number }) { }
};

export class AddItem implements Action {
  readonly type = GroupsActionsTypes.AddItem;
  constructor(public payload: { item: ItemInput, groupid: number }) { }
};

export class ItemAdded implements Action {
  readonly type = GroupsActionsTypes.ItemAdded;
  constructor(private payload: { item: Item, groupid: number }) { }
};


export class FetchGroupItems implements Action {
  readonly type = GroupsActionsTypes.FetchGroupItems;
  constructor(public payload: number) { }
};

export class GroupItemsFetched implements Action {
  readonly type = GroupsActionsTypes.GroupItemsFetched;
  constructor(private payload: { groupid: number, items: Item[] }) { }
};

export class ResetAddItemModal implements Action {
  readonly type = GroupsActionsTypes.ResetAddItemModal;
};


export class ResetCreateGroup implements Action {
  readonly type = GroupsActionsTypes.ResetCreateGroup;
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
  constructor(private payload: number) { }        // Group or GroupInput?
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

export class UpdateGroup implements Action {
  readonly type = GroupsActionsTypes.UpdateGroup;
  constructor(public payload: Group) { }        // Group or GroupInput?
};


export class GroupUpdated implements Action {
  readonly type = GroupsActionsTypes.GroupUpdated;
  constructor(private payload: Group) { }
}

export type GroupsActions = AddItem | ItemAdded | LoadGroups | GroupsLoaded | SelectGroup | CreateGroup | GroupCreated | DeleteGroup | GroupDeleted | UpdateGroup | GroupUpdated | ResetCreateGroup | FetchGroupItems | GroupItemsFetched | ResetAddItemModal | DeleteItem | ItemDeleted;
