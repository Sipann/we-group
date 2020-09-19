import pool from '../../models';


export async function mockItems () {

  try {
    console.log('MOCKING ITEMS => START');

    // id 1
    const Group1item1 = {
      name: 'Group1 Item 1',
      description: 'Group1 Item1 Description',
      price: 10,
      groupid: 1,
    };

    // id 2
    const Group1item2 = {
      name: 'Group1 Item 2',
      description: 'Group1 Item2 Description',
      price: 15,
      groupid: 1,
    };

    // id 3
    const Group1item3 = {
      name: 'Group1 Item 3',
      description: 'Group1 Item3 Description',
      price: 25,
      groupid: 1,
    };

    // id 4
    const Group2item1 = {
      name: 'Group2 Item 1',
      description: 'Group2 Item1 Description',
      price: 5,
      groupid: 2,
    };

    // id 5
    const Group2item2 = {
      name: 'Group2 Item 2',
      description: 'Group2 Item2 Description',
      price: 7,
      groupid: 2,
    };

    // id 6
    const Group3item1 = {
      name: 'Group3 Item 1',
      description: 'Group3 Item1 Description',
      price: 36,
      groupid: 3,
    };

    // id 7
    const Group3item2 = {
      name: 'Group3 Item 2',
      description: 'Group3 Item2 Description',
      price: 75,
      groupid: 3,
    };


    const items = [];
    items.push(Group1item1);
    items.push(Group1item2);
    items.push(Group1item3);
    items.push(Group2item1);
    items.push(Group2item2);
    items.push(Group3item1);
    items.push(Group3item2);

    const insertItemStr = `
      INSERT INTO items (name, description, price, group_id)
        VALUES ($1, $2, $3, $4);
    `;

    for (let item of items) {
      const { name, description, price, groupid } = item;
      await pool.query(
        insertItemStr,
        [name, description, price, groupid]
      );
    }

    console.log('MOCKING ITEMS => END');

  } catch (error) {
    console.log('MOCKING ITEMS => ERROR', error.message);
  }

}