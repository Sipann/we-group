import * as fromUserActions from '../actions/user.actions';
import { User } from 'src/app/models/user.model';
import { UserType } from 'src/app/models/refactor/user.model';

export interface UserState {
  // currentUser: User,
  currentUser: UserType,

  loaded: boolean,
  loading: boolean,
  updateIsComplete: boolean,
};

export const initialState: UserState = {
  currentUser: null,
  loaded: false,
  loading: false,
  updateIsComplete: false,
};

export const UserReducer = (state = initialState, action): UserState => {
  switch (action.type) {
    case fromUserActions.UserActionsTypes.UserLoaded:
      return {
        ...state,
        currentUser: action.payload,
      };

    case fromUserActions.UserActionsTypes.ResetUpdateStatus:
      return {
        ...state,
        updateIsComplete: false,
      };


    // case fromUserActions.UserActionsTypes.UserProfileUpdated:
    case fromUserActions.UserActionsTypes.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        updateIsComplete: true,
      };


    // case fromUserActions.UserActionsTypes.UserDataLoaded:
    case fromUserActions.UserActionsTypes.LOAD_USER_DATA_SUCCESS:
      // console.log('REDUCER UserDataLoaded =>', action.payload);
      return {
        ...state,
        currentUser: action.payload,
      };

    default:
      return state;
  }
};

//
export const getCurrentUser = (state: UserState) => state.currentUser;
//