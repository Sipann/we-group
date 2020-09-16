'use strict';

import Router from 'koa-router';
const router = new Router({
  prefix: '/user'
});

// import {} from '../controllers/testsCtrl';
import {
  CtrlCreateUser,
  CtrlUpdateUser,
  CtrlDeleteUser,
} from '../controllers/userCtrl';


router.delete('/', CtrlDeleteUser);

router.post('/', CtrlCreateUser);

router.put('/', CtrlUpdateUser);

export { router as userRouter };
