import Elysia, { Context } from 'elysia';
import { StoreClass as StoreClassType } from '../types/app';
import { StoreClass } from '../constants';

declare global {
  interface Request {
    storeClass: StoreClassType;
  }
}

export const storeClass = new Elysia({
  name: 'storeClass',
})
  .derive(({ request: req }: Context) => {
    req.storeClass = StoreClass.Default;
    return {};
  })
  .onTransform(({ request: req }: Context) => {
    if (req.ssrContext?.bootstrap?.shop.platform.suspended) {
      req.storeClass = StoreClass.Clone;
    }

    if (req.ssrContext?.bootstrap?.shop) {
      req.ssrContext.bootstrap.shop.sub_domain =
        req.ssrContext.bootstrap.shop.domain;
      req.ssrContext.bootstrap.shop.domain = req.ssrContext.host;
    }
  })
  .onBeforeHandle(({ request: req, set }) => {
    const domain = process.env.VITE_PLATFORM_DOMAIN || '';
    if (
      req.storeClass == StoreClass.Clone &&
      req.ssrContext.host.endsWith(domain)
    ) {
      set.headers['Content-Type'] = 'text/html';
      set.status = 428;
      return { statusCode: 428, title: 'Shop unavailable', error: 'policy' };
    }
  });
