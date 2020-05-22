import { Action, createAction, props } from '@ngrx/store';

import { Group } from '../../models/group.model';


export enum GroupsActionsTypes {
  LoadGroups = '[Groups] Load',
  GroupsLoaded = '[Groups] Data Loaded',
  SelectGroup = '[Groups] Select',

  CreateGroup = '[Groups] Create',
  GroupCreated = '[Groups] Group Created',

  DeleteGroup = '[Groups] Delete',
  GroupDeleted = '[Groups] Group Deleted',

  UpdateGroup = '[Groups] Update',
  GroupUpdated = '[Groups] Group Updated',

  ResetCreateGroup = '[Groups] Reset Create Group Modal'
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

export type GroupsActions = LoadGroups | GroupsLoaded | SelectGroup | CreateGroup | GroupCreated | DeleteGroup | GroupDeleted | UpdateGroup | GroupUpdated | ResetCreateGroup;
