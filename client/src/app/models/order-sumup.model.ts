export class OrderSumup {
  username: string;
  itemname: string;
  orderedquantity: number;

  static parse(data) {
    const ordersumup = Object.assign(new OrderSumup(), data);
    return ordersumup;
  }
}