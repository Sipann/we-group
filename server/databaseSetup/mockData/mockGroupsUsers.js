import pool from '../../models';
import firebaseUsers from './firebaseUsers';
import fakeUsers from './fakeUsers';

const env = process.env.NODE_ENV || 'development';

let mockedUsers;
if (env === 'development') mockedUsers = firebaseUsers;
else if (env === 'test') mockedUsers = fakeUsers;

export async function mockGroupsUsers () {

  try {
    console.log('MOCKING GROUPSUSERS => START');

    const groupsusersStr = `
      INSERT INTO groupsusers (group_id, user_id)
        VALUES ($1, $2);
    `;

    await pool.query(groupsusersStr, [1, 'user1']);        // add user1 to group1 (manager)
    await pool.query(groupsusersStr, [2, 'user2']);        // add user2 to group2 (manager)
    await pool.query(groupsusersStr, [3, 'user3']);        // add user3 to group3 (manager)
    await pool.query(groupsusersStr, [2, 'user4']);        // add user4 to group2 (member)
    await pool.query(groupsusersStr, [2, 'user5']);        // add user5 to group2 (member)
    await pool.query(groupsusersStr, [3, 'user4']);        // add user4 to group3 (member)
    await pool.query(groupsusersStr, [3, 'user5']);        // add user5 to group3 (member)
    await pool.query(groupsusersStr, [2, 'user8']);        // add user8 to group2 (member)

    console.log('MOCKING GROUPSUSERS => END');


  } catch (error) {
    console.log('MOCKING GROUPSUSERS ERROR =>', error.message);
  }

}