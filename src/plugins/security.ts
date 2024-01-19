import Elysia, { Context } from 'elysia';
import { SSRBootstrap } from '../types/app';

declare global {
  interface Request {
    bootstrap?: SSRBootstrap;
  }
}

export const security = new Elysia({
  name: 'security',
}).onBeforeHandle(({ request: req, set }: Context) => {
  if (!req?.ssrContext?.bootstrap || !req?.ssrContext?.isCheckout) {
    return;
  }

  const { csp_checkout } = req.ssrContext.bootstrap.secure;
  if (csp_checkout.nonce_format.length) {
    set.headers['X-SB-NONCE'] = csp_checkout.nonce_format;
  }
  if (csp_checkout.report_only) {
    set.headers['Content-Security-Policy-Report-Only'] = csp_checkout.policy;
  }
  if (csp_checkout.enable) {
    set.headers['Content-Security-Policy'] = csp_checkout.policy;
  }
  if (csp_checkout.report_to.length && csp_checkout.report_uri.length) {
    set.headers[
      'Reporting-Endpoints'
    ] = `${csp_checkout.report_to}="${csp_checkout.report_uri}"`;
  }
});
