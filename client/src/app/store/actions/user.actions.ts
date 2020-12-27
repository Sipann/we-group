import { Action, createAction, props } from '@ngrx/store';

import { User } from '../../models/user.model';
import { UserType } from '../../models/refactor/user.model';


export enum UserActionsTypes {
  LoadUser = '[User] Load',
  UserLoaded = '[User] Loaded',

  // LoadUserData = '[User] Load UserData',
  LOAD_USER_DATA = '[User] Load UserData Action',
  // UserDataLoaded = '[User] UserData Loaded',
  LOAD_USER_DATA_SUCCESS = '[User] Load UserData Success',
  LOAD_USER_DATA_FAIL = '[User] Load UserData Fail',

  // UpdateUserProfile = '[User] Update User Profile',
  UPDATE_USER_PROFILE = '[User] Update User Profile Action',
  // UserProfileUpdated = '[User] User Profile Updated',
  UPDATE_USER_PROFILE_SUCCESS = '[User] Update User Profile Success',
  UPDATE_USER_PROFILE_FAIL = '[User] Update User Profile Fail',
  ResetUpdateStatus = '[User] Reset Update Status',
};

export class LoadUserData implements Action {
  // readonly type = UserActionsTypes.LoadUserData;
  readonly type = UserActionsTypes.LOAD_USER_DATA;
  constructor(public payload: { userid: string }) { }
};

export class LoadUserDataFail implements Action {
  readonly type = UserActionsTypes.LOAD_USER_DATA_FAIL;
  constructor() { }
}

export class LoadUserDataSuccess implements Action {
  // readonly type = UserActionsTypes.UserDataLoaded;
  readonly type = UserActionsTypes.LOAD_USER_DATA_SUCCESS;
  // constructor(private payload: User) { }
  constructor(private payload: UserType) { }
};

export class UpdateUserProfile implements Action {
  readonly type = UserActionsTypes.UPDATE_USER_PROFILE;
  // constructor(public payload: User) { }
  constructor(public payload: UserType) { }
};

export class UpdateUserProfileFail implements Action {
  readonly type = UserActionsTypes.UPDATE_USER_PROFILE_FAIL;
  constructor() { }
}

// export class UserProfileUpdated implements Action {
export class UpdateUserProfileSuccess implements Action {
  readonly type = UserActionsTypes.UPDATE_USER_PROFILE_SUCCESS;
  // constructor(private payload: User) { }
  constructor(private payload: UserType) { }
};

// export class LoadUser implements Action {
//   readonly type = UserActionsTypes.LoadUser;
//   constructor(private payload: string) { }
// };

// export class UserLoaded implements Action {
//   readonly type = UserActionsTypes.UserLoaded;
//   constructor(private payload: User) { }
// };


// export class ResetUpdateStatus implements Action {
//   readonly type = UserActionsTypes.ResetUpdateStatus;
// }


export type UserActions = LoadUserData |
  LoadUserDataFail |
  LoadUserDataSuccess |
  UpdateUserProfile |
  UpdateUserProfileFail |
  UpdateUserProfileSuccess

  // LoadUser |
  // UserLoaded |
  // UserDataLoaded |
  // ResetUpdateStatus
  // UserProfileUpdated;