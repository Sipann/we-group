import * as fromUserActions from '../actions/user.actions';
import { User } from 'src/app/models/user.model';

export interface UserState {
  currentUser: User,
  loaded: boolean,
  loading: boolean,
};

export const initialState: UserState = {
  currentUser: null,
  loaded: false,
  loading: false,
};

export const UserReducer = (state = initialState, action): UserState => {
  switch (action.type) {
    case fromUserActions.UserActionsTypes.UserLoaded:
      return {
        currentUser: action.payload,
        loaded: state.loaded,
        loading: state.loading,
      };
    case fromUserActions.UserActionsTypes.UserDataLoaded:
      return {
        currentUser: action.payload.userDetails,
        loaded: state.loaded,
        loading: state.loading,
      }
    default:
      return state;
  }
};