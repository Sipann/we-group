import pool from '../../models';


export async function mockOrderedItems () {

  try {
    console.log('MOCKING ORDERED ITEMS => START');

    const orderedItem1 = { quantity: 6, item_id: 1, available_item_id: 1, placed_order_id: 1, available_order_id: 1 };
    const orderedItem2 = { quantity: 10, item_id: 2, available_item_id: 2, placed_order_id: 1, available_order_id: 1 };
    const orderedItem3 = { quantity: 10, item_id: 1, available_item_id: 3, placed_order_id: 2, available_order_id: 2 };
    const orderedItem4 = { quantity: 2, item_id: 1, available_item_id: 5, placed_order_id: 3, available_order_id: 3 };
    const orderedItem5 = { quantity: 15, item_id: 2, available_item_id: 6, placed_order_id: 3, available_order_id: 3 };
    const orderedItem6 = { quantity: 3, item_id: 4, available_item_id: 8, placed_order_id: 4, available_order_id: 4 };
    const orderedItem7 = { quantity: 3, item_id: 5, available_item_id: 9, placed_order_id: 5, available_order_id: 4 };
    const orderedItem8 = { quantity: 2, item_id: 5, available_item_id: 9, placed_order_id: 6, available_order_id: 4 };
    const orderedItem9 = { quantity: 6, item_id: 4, available_item_id: 10, placed_order_id: 7, available_order_id: 5 };
    const orderedItem10 = { quantity: 3, item_id: 4, available_item_id: 10, placed_order_id: 8, available_order_id: 5 };
    const orderedItem11 = { quantity: 1, item_id: 4, available_item_id: 10, placed_order_id: 9, available_order_id: 5 };
    const orderedItem12 = { quantity: 5, item_id: 4, available_item_id: 12, placed_order_id: 10, available_order_id: 6 };
    const orderedItem13 = { quantity: 3, item_id: 4, available_item_id: 12, placed_order_id: 12, available_order_id: 6 };
    const orderedItem14 = { quantity: 1, item_id: 5, available_item_id: 13, placed_order_id: 10, available_order_id: 6 };
    const orderedItem15 = { quantity: 2, item_id: 5, available_item_id: 13, placed_order_id: 11, available_order_id: 6 };
    const orderedItem16 = { quantity: 2, item_id: 5, available_item_id: 13, placed_order_id: 12, available_order_id: 6 };
    const orderedItem17 = { quantity: 4, item_id: 6, available_item_id: 14, placed_order_id: 13, available_order_id: 7 };
    const orderedItem18 = { quantity: 1, item_id: 6, available_item_id: 14, placed_order_id: 14, available_order_id: 7 };
    const orderedItem19 = { quantity: 5, item_id: 7, available_item_id: 15, placed_order_id: 13, available_order_id: 7 };
    const orderedItem20 = { quantity: 5, item_id: 7, available_item_id: 15, placed_order_id: 14, available_order_id: 7 };
    const orderedItem21 = { quantity: 5, item_id: 7, available_item_id: 15, placed_order_id: 15, available_order_id: 7 };
    const orderedItem22 = { quantity: 6, item_id: 6, available_item_id: 16, placed_order_id: 16, available_order_id: 8 };
    const orderedItem23 = { quantity: 4, item_id: 6, available_item_id: 16, placed_order_id: 17, available_order_id: 8 };
    const orderedItem24 = { quantity: 1, item_id: 7, available_item_id: 17, placed_order_id: 16, available_order_id: 8 };
    const orderedItem25 = { quantity: 2, item_id: 7, available_item_id: 17, placed_order_id: 17, available_order_id: 8 };
    const orderedItem26 = { quantity: 2, item_id: 7, available_item_id: 17, placed_order_id: 18, available_order_id: 8 };



    const orderedItems = [];
    orderedItems.push(orderedItem1);
    orderedItems.push(orderedItem2);
    orderedItems.push(orderedItem3);
    orderedItems.push(orderedItem4);
    orderedItems.push(orderedItem5);
    orderedItems.push(orderedItem6);
    orderedItems.push(orderedItem7);
    orderedItems.push(orderedItem8);
    orderedItems.push(orderedItem9);
    orderedItems.push(orderedItem10);
    orderedItems.push(orderedItem11);
    orderedItems.push(orderedItem12);
    orderedItems.push(orderedItem13);
    orderedItems.push(orderedItem14);
    orderedItems.push(orderedItem15);
    orderedItems.push(orderedItem16);
    orderedItems.push(orderedItem17);
    orderedItems.push(orderedItem18);
    orderedItems.push(orderedItem19);
    orderedItems.push(orderedItem20);
    orderedItems.push(orderedItem21);
    orderedItems.push(orderedItem22);
    orderedItems.push(orderedItem23);
    orderedItems.push(orderedItem24);
    orderedItems.push(orderedItem25);
    orderedItems.push(orderedItem26);



    const insertOrderedItemStr = `
      INSERT INTO ordered_items (quantity, item_id, available_item_id, placed_order_id, available_order_id)
        VALUES ($1, $2, $3, $4, $5);
    `;

    for (let orderedItem of orderedItems) {
      const { quantity, item_id, available_item_id, placed_order_id, available_order_id } = orderedItem;
      await pool.query(
        insertOrderedItemStr,
        [quantity, item_id, available_item_id, placed_order_id, available_order_id]
      );
    }

    console.log('MOCKING ORDERED ITEMS => END');

  } catch (error) {
    console.log('MOCKING ORDERED ITEMS => ERROR', error.message);
  }

}
