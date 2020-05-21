import { Action, createAction, props } from '@ngrx/store';

import { User } from '../../models/user.model';
import { Group } from '../../models/group.model'

export interface UserData {
  userDetails: User,
  userGroups: Group[],
}


export enum UserActionsTypes {
  LoadUser = '[User] Load',
  UserLoaded = '[User] Loaded',
  LoadUserData = '[User] Load UserData',
  UserDataLoaded = '[User] UserData Loaded',
};

export class LoadUser implements Action {
  readonly type = UserActionsTypes.LoadUser;
  constructor(private payload: string) { }
};

export class UserLoaded implements Action {
  readonly type = UserActionsTypes.UserLoaded;
  constructor(private payload: User) { }
};

export class LoadUserData implements Action {
  readonly type = UserActionsTypes.LoadUserData;
  constructor(public payload: string) { }
};

export class UserDataLoaded implements Action {
  readonly type = UserActionsTypes.UserDataLoaded;
  constructor(private payload: UserData) { }
};

export type UserActions = LoadUser | UserLoaded | LoadUserData | UserDataLoaded;