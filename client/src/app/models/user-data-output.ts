import { User } from './user.model';
import { Group } from './group.model';
import { GroupOrderDB } from './group-order-db.model';

export class UserDataOutput {
  ok: boolean;
  payload: {
    userDetails: User,
    userGroups: Group[],
    userOrders: GroupOrderDB[]
  }
}

export type UserDataStaticOutput = {
  userDetails: User,
  userGroups: Group[],
  userOrders: GroupOrderDB[],
};