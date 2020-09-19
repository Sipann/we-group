import pool from '../../models';

const env = process.env.NODE_ENV || 'development';

const now = new Date();
const nowMs = now.getTime();
const oneDayMs = 1000 * 60 * 60 * 24;
const oneWeekMs = oneDayMs * 7;
const oneMonthMs = 4.2 * oneWeekMs;
const oneWeekAgo = nowMs - oneWeekMs;
const oneWeekAgoMinus3D = oneWeekAgo - (3 * oneDayMs);
const oneWeekAgoMinus2D = oneWeekAgo - (2 * oneDayMs);
const oneWeekAgoDate = new Date(oneWeekAgo);
const oneWeekAgoMinus3DDate = new Date(oneWeekAgoMinus3D);
const oneWeekAgoMinus2DDate = new Date(oneWeekAgoMinus2D);
const twoWeeksLater = nowMs + 2 * oneWeekMs;
const twoWeeksLaterDate = new Date(twoWeeksLater);
const twoWeeksLaterMinus3D = twoWeeksLater - (3 * oneDayMs);
export const twoWeeksLaterMinus3DDate = new Date(twoWeeksLaterMinus3D);
const twoWeeksLaterMinus4D = twoWeeksLater - (4 * oneDayMs);
export const twoWeeksLaterMinus4DDate = new Date(twoWeeksLaterMinus4D);
const threeWeeksLater = nowMs + 3 * oneWeekMs;
const threeWeeksLaterMinus3D = threeWeeksLater - (3 * oneDayMs);
export const threeWeeksLaterDate = new Date(threeWeeksLater);
export const threeWeeksLaterMinus3DDate = new Date(threeWeeksLaterMinus3D);

export async function mockAvailableOrders () {

  try {
    console.log('MOCKING AVAILABLE ORDERS => START');

    const availableOrderStr = `
      INSERT INTO available_orders (deadline_ts, delivery_ts, delivery_status, confirmed_status, group_id)
        VALUES ($1, $2, $3, $4, $5);
    `;

    // Group1 Available Order #1 - passed deadlineTs && deliveryTs    #id 1
    await pool.query(
      availableOrderStr,
      [oneWeekAgoMinus2DDate, oneWeekAgoDate, 'done', true, 1]
    );

    // Group1 Available Order #2 - passed deadlineTs && coming deliveryTs    #id 2
    await pool.query(
      availableOrderStr,
      [oneWeekAgoDate, twoWeeksLaterDate, 'ongoing', true, 1]
    );

    // Group1 Available Order #3 - coming deadlineTs && deliveryTs    #id 3
    await pool.query(
      availableOrderStr,
      [threeWeeksLaterMinus3DDate, threeWeeksLaterDate, 'pending', false, 1]
    );

    // Group2 Available Order #1 - passed deadlineTs && deliveryTs    #id 4
    await pool.query(
      availableOrderStr,
      [oneWeekAgoMinus2DDate, oneWeekAgoDate, 'done', true, 2]
    );

    // Group2 Available Order #2 - passed deadlineTs && coming deliveryTs    #id 5
    await pool.query(
      availableOrderStr,
      [oneWeekAgoDate, twoWeeksLaterDate, 'ongoing', true, 2]
    );

    // Group2 Available Order #3 - coming deadlineTs && deliveryTs    #id 6
    await pool.query(
      availableOrderStr,
      [threeWeeksLaterMinus3DDate, threeWeeksLaterDate, 'pending', false, 2]
    );

    // Group3 Available Order #1 - passed deadlineTs && deliveryTs    #id 7
    await pool.query(
      availableOrderStr,
      [oneWeekAgoMinus3DDate, oneWeekAgoDate, 'done', true, 3]
    );

    // Group3 Available Order #2 - passed deadlineTs && coming deliveryTs    #id 8
    await pool.query(
      availableOrderStr,
      [oneWeekAgoMinus2DDate, oneWeekAgoDate, 'done', true, 3]
    );

    // Group3 Available Order #3 - coming deadlineTs && deliveryTs    #id 9
    await pool.query(
      availableOrderStr,
      [threeWeeksLaterMinus3DDate, threeWeeksLaterDate, 'pending', false,]
    );

    console.log('MOCKING AVAILABLE ORDERS => END');

  } catch (error) {
    console.log('MOCKING AVAILABLE ORDERS => ERROR', error.message);
  }

}
