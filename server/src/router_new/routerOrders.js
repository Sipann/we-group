'use strict';

import Router from 'koa-router';
const router = new Router({
  prefix: '/orders'
});

import {
  CtrlDeletePlacedOrder,
  CtrlFetchPlacedOrder,
  CtrlFetchGroupPlacedOrders,
  CtrlPlaceOrder,
  CtrlUpdatePlacedOrder,
} from '../controllers/orderCtrl';


router.get('/placed/all/:availableorderid', CtrlFetchGroupPlacedOrders);
router.get('/placed/:placedorderid', CtrlFetchPlacedOrder);


router.delete('/placed/:placedorderid', CtrlDeletePlacedOrder);

router.post('/:availableorderid', CtrlPlaceOrder);

router.put('/placed/:placedorderid', CtrlUpdatePlacedOrder);

export { router as ordersRouter };
