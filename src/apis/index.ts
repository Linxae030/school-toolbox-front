import Request from "./requests";
import { BASE_URL, TIME_OUT } from "./requests/config";
const LinRequest = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

export default LinRequest;
export * from './user'
export * from './link'
