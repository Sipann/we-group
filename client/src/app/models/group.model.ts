export class Group {
  id: number;
  name: string;
  description: string;
  currency: string;
  manager_id: string;
  image?: string;
  deadline?: string;

  static parse(data) {
    const group = Object.assign(new Group(), data);

    return group;
  }

}