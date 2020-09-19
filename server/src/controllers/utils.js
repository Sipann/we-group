import { errorMessages } from '../utils/errorMessages';

export function handleErrorCtrl (ctx, error) {
  const { message } = error;
  // console.log('handleErrorCtrl message =>', message);
  if (message === errorMessages.unnecessary) ctx.throw(202, errorMessages.unnecessary);
  else if (message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
  else if (message === errorMessages.invalidInput) ctx.throw(400, errorMessages.invalidInput);
  else if (message === errorMessages.notAllowed) ctx.throw(401, errorMessages.notAllowed);
  else ctx.throw(500, errorMessages.internalServerError);
}


// const { errorMessages } = require('../utils/errorMessages');

// exports.handleErrorCtrl = (ctx, message) => {
//   if (message === errorMessages.unnecessary) ctx.throw(202, errorMessages.unnecessary);
//   else if (message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
//   else if (message === errorMessages.notAllowed) ctx.throw(401, errorMessages.notAllowed);
//   else ctx.throw(500, errorMessages.internalServerError);
// };