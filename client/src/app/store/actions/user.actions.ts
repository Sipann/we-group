import { Action, createAction, props } from '@ngrx/store';

import { User } from '../../models/user.model';


export enum UserActionsTypes {
  LoadUser = '[User] Load',
  UserLoaded = '[User] Loaded',
  LoadUserData = '[User] Load UserData',
  UserDataLoaded = '[User] UserData Loaded',
  UpdateUserProfile = '[User] Update User Profile',
  UserProfileUpdated = '[User] User Profile Updated',
  ResetUpdateStatus = '[User] Reset Update Status',
};

export class LoadUser implements Action {
  readonly type = UserActionsTypes.LoadUser;
  constructor(private payload: string) { }
};

export class UserLoaded implements Action {
  readonly type = UserActionsTypes.UserLoaded;
  constructor(private payload: User) { }
};


//

export class LoadUserData implements Action {
  readonly type = UserActionsTypes.LoadUserData;
  constructor(public payload: { userid: string }) { }
};

export class ResetUpdateStatus implements Action {
  readonly type = UserActionsTypes.ResetUpdateStatus;
}

export class UpdateUserProfile implements Action {
  readonly type = UserActionsTypes.UpdateUserProfile;
  constructor(public payload: User) { }
};

export class UserProfileUpdated implements Action {
  readonly type = UserActionsTypes.UserProfileUpdated;
  constructor(private payload: User) { }
};

export class UserDataLoaded implements Action {
  readonly type = UserActionsTypes.UserDataLoaded;
  constructor(private payload: User) { }
};



export type UserActions = LoadUser |
  UserLoaded |
  LoadUserData |
  UserDataLoaded |
  UpdateUserProfile |
  ResetUpdateStatus |
  UserProfileUpdated;