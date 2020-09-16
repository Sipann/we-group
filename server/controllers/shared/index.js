import { errorMessages } from '../../utils/errorMessages';

export function handleErrorCtrl (ctx, message) {
  if (message === errorMessages.unnecessary) ctx.throw(202, errorMessages.unnecessary);
  else if (message === errorMessages.missingArguments) ctx.throw(400, errorMessages.missingArguments);
  else if (message === errorMessages.notAllowed) ctx.throw(401, errorMessages.notAllowed);
  else ctx.throw(500, errorMessages.internalServerError);
}