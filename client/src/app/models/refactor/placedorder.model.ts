export enum DeliveryStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  DONE = 'done',
}

export type PlacedOrder = {
  userid: string,
  groupid: string,
  placedorderid: string,
  ordereditemsquantity: number,
  availableorderdeadlinets: Date,
  availableorderdeliveryts: Date,
  availableorderdeliverystatus: DeliveryStatus,
  availableorderconfirmedstatus?: boolean,
  groupname: string,
  itemid: string,
  itemname: string,
  itemprice: string
}