export class GroupOrder {

  order_confirmed_status: boolean;
  order_deadline_ts: string;
  order_delivery_status: 'pending' | 'done';
  order_delivery_ts: string;
  summary: {
    byItem: {},
    byUser: {},
  };

}
