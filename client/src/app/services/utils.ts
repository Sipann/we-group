import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { GroupAvailableOrders } from 'src/app/models/group-order-available.model';
import { format } from 'date-fns';


export const handleError = (error: HttpErrorResponse) => {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${ error.status }, ` +
      `body was: ${ error.error }`);

    if (error.status === 400) {
      return throwError('Bad Request');
    }
    else if (error.status === 401) {
      return throwError('Unauthorized');
    }
    else if (error.status === 500) {
      return throwError('Server Internal Error');
    }
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};

export function formatAvailableOrders(availableOrders: GroupAvailableOrders) {
  const formatted = { ...availableOrders };
  for (let orderId in availableOrders) {
    formatted[orderId] = {
      ...availableOrders[orderId],
      deliveryTs: format(new Date(availableOrders[orderId].deliveryTs), 'MM/dd/yyyy'),
      deadlineTs: format(new Date(availableOrders[orderId].deadlineTs), 'MM/dd/yyyy'),
    }
  }
  return formatted;
}