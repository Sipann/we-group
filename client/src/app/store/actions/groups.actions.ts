import { Action, createAction, props } from '@ngrx/store';

import { Group } from '../../models/group.model';


export enum GroupsActionsTypes {
  LoadGroups = '[Groups] Load',
  GroupsLoaded = '[Groups] Data Loaded',
  SelectGroup = '[Groups] Select',
  CreateGroup = '[Groups] Create',
  GroupCreated = '[Groups] Group Created',
  DeleteGroup = '[Groups] Delete',
  UpdateGroup = '[Groups] Update',
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
  constructor(private payload: Group) { }        // Group or GroupInput?
};

export class CreateGroup implements Action {
  readonly type = GroupsActionsTypes.CreateGroup;
  constructor(private payload: Group) { }        // Group or GroupInput?
};

export class GroupCreated implements Action {
  readonly type = GroupsActionsTypes.GroupCreated;
  constructor(private payload: Group) { }        // Group or GroupInput?
}

export class DeleteGroup implements Action {
  readonly type = GroupsActionsTypes.DeleteGroup;
  constructor(private payload: Group) { }        // Group or GroupInput?
};

export class UpdateGroup implements Action {
  readonly type = GroupsActionsTypes.UpdateGroup;
  constructor(private payload: Group) { }        // Group or GroupInput?
};

export type GroupsActions = LoadGroups | GroupsLoaded | SelectGroup | CreateGroup | GroupCreated | DeleteGroup | UpdateGroup;
