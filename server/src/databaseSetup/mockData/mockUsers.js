import pool from '../../models';
import firebaseUsers from './firebaseUsers';
import fakeUsers from './fakeUsers';

const env = process.env.NODE_ENV || 'development';

let mockedUsers;
if (env === 'development') mockedUsers = firebaseUsers;
else if (env === 'test') mockedUsers = fakeUsers;


export async function mockUsers () {

  try {
    console.log('MOCKING USERS => START');

    const userQueryStr = `
      INSERT INTO users (id, name, email, phone, preferred_contact_mode)
        VALUES ($1, $2, $3, $4, $5);
    `;

    await pool.query(userQueryStr, [...mockedUsers.user1.values()]);
    await pool.query(userQueryStr, [...mockedUsers.user2.values()]);
    await pool.query(userQueryStr, [...mockedUsers.user3.values()]);
    await pool.query(userQueryStr, [...mockedUsers.user4.values()]);
    await pool.query(userQueryStr, [...mockedUsers.user5.values()]);
    await pool.query(userQueryStr, [...mockedUsers.user6.values()]);
    await pool.query(userQueryStr, [...mockedUsers.user8.values()]);

    console.log('MOCKING USERS => END');

  } catch (error) {
    console.log('MOCKING USERS => ERROR', error.message);
  }

}
