import * as fromUserActions from '../actions/user.actions';
import { User } from 'src/app/models/user.model';


export interface UserState {
  currentUser: User,
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


    //

    case fromUserActions.UserActionsTypes.ResetUpdateStatus:
      return {
        ...state,
        updateIsComplete: false,
      };


    case fromUserActions.UserActionsTypes.UserProfileUpdated:
      return {
        ...state,
        currentUser: action.payload,
        updateIsComplete: true,
      };


    case fromUserActions.UserActionsTypes.UserDataLoaded:
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