import Item from '../models/item.model';

export class GroupOrderAvailable {

  id: string;
  deadline_ts: string;
  delivery_ts: string;
  confirmed_status: null;
  delivery_status: null;
  group_id: string;

  // static parse(data) {
  //   const groupOrderAvailable = Object.assign(new GroupOrderAvailable(), data);
  //   return groupOrderAvailable;
  // }

}

// key: availableOrder id
export type GroupAvailableOrders = {
  [key: string]: {
    deadlineTs: string,
    deliveryTs: string,
    confirmedStatus: boolean | null,
    deliveryStatus: 'pending' | 'ongoing' | 'done' | null,
    items: Item[],
  }
}