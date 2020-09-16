export class OrderUser {
  // TODO

  static parse(data) {
    const orderUser = Object.assign(new OrderUser(), data);
    return orderUser;
  }
}