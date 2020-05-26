import { Item } from './item.model';

export class Group {
  id?: number;
  name?: string;
  description?: string;
  currency?: string;
  manager_id?: string;
  image?: string;
  deadline?: string;
  items?: Item[];
  members?: { name: string, id: string }[];
  order?: { byItem, byUser };

  static parse(data) {
    const group = Object.assign(new Group(), data);

    return group;
  }

}