export class User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_contact_mode: 'phone' | 'email' | 'both';

  static parse(data) {
    const user = Object.assign(new User(), data);
    return user;
  }

}