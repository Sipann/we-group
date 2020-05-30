export class GroupOrderDB {

  group_id: string;
  group_name: string;
  item_id: string;
  item_name: string;
  item_ordered_quantity: number;
  item_price: string;
  order_confirmed_status: boolean;
  order_deadline_ts: string;
  order_delivery_status: 'pending' | 'done';
  order_delivery_ts: string;
  order_id: string;
  user_id: string;
  user_name: string

  static parse(data) {
    const groupOrderDB = Object.assign(new GroupOrderDB(), data);
    return groupOrderDB;
  }

}