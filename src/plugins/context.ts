import { SSRContext } from "../types/app";

declare global {
  interface Request {
    ssrContext: SSRContext;
    http: any;
  }
}
