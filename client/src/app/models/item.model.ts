export class Item {
  // id: number;
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  initial_qty: number;
  remaining_qty: number;
  group_id: number;

  static parse(data) {
    const item = Object.assign(new Item(), data);
    return item;
  }

}