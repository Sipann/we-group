export class Order {
  id: number;
  date: string;
  total_price: number;
  total_currency: string;
  group_id: number;
  user_id: string;

  static parse(data) {
    const order = Object.assign(new Order(), data);
    return order;
  }

}