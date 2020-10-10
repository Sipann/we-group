import { Item } from './item.model';

export class Group {
  // id?: number;
  id?: string;
  name?: string;
  description?: string;
  currency?: string;
  manager_id?: string;

  image?: string;
  deadline?: string;
  items?: Item[];
  members?: { username: string, userid: string, manager?: boolean }[];
  order?: { byItem, byUser };
  orders?;    //!

  static parse(data) {
    const group = Object.assign(new Group(), data);
    return group;
  }

}