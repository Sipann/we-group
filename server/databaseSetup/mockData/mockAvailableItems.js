import pool from '../../models';


export async function mockAvailableItems () {

  try {
    console.log('MOCKING AVAILABLE ITEMS => START');

    // GROUP1 AVAILABLE ORDER 1

    const group1Available1Item1 = {
      item_id: 1,
      initial_qty: 12,
      remaining_qty: 6,
      available_order_id: 1,
    };

    const group1Available1Item2 = {
      item_id: 2,
      initial_qty: 10,
      remaining_qty: 0,
      available_order_id: 1,
    };

    // GROUP1 AVAILABLE ORDER 2

    const group1Available2Item1 = {
      item_id: 1,
      initial_qty: 20,
      remaining_qty: 10,
      available_order_id: 2,
    };

    const group1Available2Item2 = {
      item_id: 2,
      initial_qty: 10,
      remaining_qty: 10,
      available_order_id: 2,
    };

    // GROUP1 AVAILABLE ORDER 3

    const group1Available3Item1 = {
      item_id: 1,
      initial_qty: 10,
      remaining_qty: 8,
      available_order_id: 3,
    };

    const group1Available3Item2 = {
      item_id: 2,
      initial_qty: 15,
      remaining_qty: 0,
      available_order_id: 3,
    };

    const group1Available3Item3 = {
      item_id: 3,
      initial_qty: 10,
      remaining_qty: 10,
      available_order_id: 3,
    };


    // GROUP2 AVAILABLE ORDER 1

    const group2Available1Item1 = {
      item_id: 4,
      initial_qty: 10,
      remaining_qty: 7,
      available_order_id: 4,
    };

    const group2Available1Item2 = {
      item_id: 5,
      initial_qty: 10,
      remaining_qty: 5,
      available_order_id: 4,
    };


    // GROUP2 AVAILABLE ORDER 2

    const group2Available2Item1 = {
      item_id: 4,
      initial_qty: 10,
      remaining_qty: 0,
      available_order_id: 5,
    };

    const group2Available2Item2 = {
      item_id: 5,
      initial_qty: 10,
      remaining_qty: 10,
      available_order_id: 5,
    };

    // GROUP2 AVAILABLE ORDER 2

    const group2Available3Item1 = {
      item_id: 4,
      initial_qty: 10,
      remaining_qty: 2,
      available_order_id: 6,
    };

    const group2Available3Item2 = {
      item_id: 5,
      initial_qty: 10,
      remaining_qty: 6,
      available_order_id: 6,
    };


    // GROUP2 AVAILABLE ORDER 3 => EMPTY

    // GROUP3 AVAILABLE ORDER 1
    const group3Available1Item1 = {
      item_id: 6,
      initial_qty: 10,
      remaining_qty: 5,
      available_order_id: 7,
    };

    const group3Available1Item2 = {
      item_id: 7,
      initial_qty: 20,
      remaining_qty: 5,
      available_order_id: 7,
    };

    // GROUP3 AVAILABLE ORDER 2
    const group3Available2Item1 = {
      item_id: 6,
      initial_qty: 10,
      remaining_qty: 0,
      available_order_id: 8,
    };

    const group3Available2Item2 = {
      item_id: 7,
      initial_qty: 20,
      remaining_qty: 15,
      available_order_id: 8,
    };


    const items = [];
    items.push(group1Available1Item1);
    items.push(group1Available1Item2);
    items.push(group1Available2Item1);
    items.push(group1Available2Item2);
    items.push(group1Available3Item1);
    items.push(group1Available3Item2);
    items.push(group1Available3Item3);
    items.push(group2Available1Item1);
    items.push(group2Available1Item2);
    items.push(group2Available2Item1);
    items.push(group2Available2Item2);
    items.push(group2Available3Item1);
    items.push(group2Available3Item2);
    items.push(group3Available1Item1);
    items.push(group3Available1Item2);
    items.push(group3Available2Item1);
    items.push(group3Available2Item2);

    const insertAvailableItemStr = `
      INSERT INTO available_items (item_id, initial_qty, remaining_qty, available_order_id)
        VALUES ($1, $2, $3, $4);
    `;

    for (let item of items) {
      const { item_id, initial_qty, remaining_qty, available_order_id } = item;
      await pool.query(
        insertAvailableItemStr,
        [item_id, initial_qty, remaining_qty, available_order_id]
      );
    }

    console.log('MOCKING AVAILABLE ITEMS => END');

  } catch (error) {
    console.log('MOCKING AVAILABLE ITEMS => ERROR', error.message);
  }

}
