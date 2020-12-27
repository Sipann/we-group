import { environment } from '../../environments/environment';

const baseUrl = environment.apiBaseUrl;
export const FETCH_USER_URL = `${ baseUrl }/user`;
export const UPDATE_USER_URL = `${ baseUrl }/users`;