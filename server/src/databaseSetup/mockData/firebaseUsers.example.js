// 'id', 'name' and 'email' MUST be real data from Firebase registered users
// 'phone' and 'preferred_contact_mode' are at mocker's discretion.
// 'id', 'name', 'email' and 'phone' values MUST be unique to the user.


const user1 = new Map();
user1.set('id', '<firebase user uid>');
user1.set('name', '<firebase user name>');
user1.set('email', '<firebase user email>');
user1.set('phone', '<fake_unique_phone_number || null>');
user1.set('preferred_contact_mode', '<phone || email>');


const user2 = new Map();
user2.set('id', '<firebase user uid>');
user2.set('name', '<firebase user name>');
user2.set('email', '<firebase user email>');
user2.set('phone', '<fake_unique_phone_number || null>');
user2.set('preferred_contact_mode', '<phone || email>');


const user3 = new Map();
user3.set('id', '<firebase user uid>');
user3.set('name', '<firebase user name>');
user3.set('email', '<firebase user email>');
user3.set('phone', '<fake_unique_phone_number || null>');
user3.set('preferred_contact_mode', '<phone || email>');


export default {
  user1,
  user2,
  user3,
};
