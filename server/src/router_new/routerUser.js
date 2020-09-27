'use strict';

// import * as Router from 'koa-router';
import Router from 'koa-router';
const router = new Router({
  prefix: '/user'
});

import {
  CtrlCreateUser,
  CtrlUpdateUser,
  CtrlDeleteUser,
  CtrlFetchUserDataCustom,
} from '../controllers/userCtrl';


router.get('/', CtrlFetchUserDataCustom);

router.delete('/', CtrlDeleteUser);

router.post('/', CtrlCreateUser);

router.put('/', CtrlUpdateUser);

export { router as userRouter };
