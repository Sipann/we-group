import pool from '../../models';
import firebaseUsers from './firebaseUsers';
import fakeUsers from './fakeUsers';

const env = process.env.NODE_ENV || 'development';

let mockedUsers;
if (env === 'development') mockedUsers = firebaseUsers;
else if (env === 'test') mockedUsers = fakeUsers;

export const group1 = {
  data: {
    name: 'Boulangerie du Front de Mer',
    description: 'Traditional French Bakery',
    currency: 'eur',
  },
  manager_id: mockedUsers.user1.get('id')
};

export const group2 = {
  data: {
    name: 'Barajas',
    description: 'Fruits & Vegetables',
    currency: 'eur',
  },
  manager_id: mockedUsers.user2.get('id')
};

export const group3 = {
  data: {
    name: 'Bella Vita',
    description: 'Italian Delicatessen',
    currency: 'eur',
  },
  manager_id: mockedUsers.user3.get('id')
};

export const group4 = {
  data: {
    name: 'Bon Appetit',
    description: 'French Cuisine',
    currency: 'eur',
  },
  manager_id: null
};


export async function mockGroups () {

  const groups = [];
  groups.push(group1);   // id 1
  groups.push(group2);   // id 2
  groups.push(group3);   // id 3

  try {
    console.log('MOCKING GROUPS => START');

    for (let group of groups) {
      const { data: { name, description, currency } } = group;

      const groupQueryStr = `
        INSERT INTO groups (name, description, currency, manager_id)
          VALUES ($1, $2, $3, $4);
      `;
      await pool.query(
        groupQueryStr,
        [name, description, currency, group.manager_id]);
    }

    console.log('MOCKING GROUPS => END');

  } catch (error) {
    console.log('MOCKING GROUPS => ERROR', error.message);
  }
}