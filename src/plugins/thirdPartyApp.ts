import Elysia from 'elysia';
import { CacheKeys } from '../constants';
import rootPath from 'app-root-path';
import fs from 'fs';
import { CustomContext } from '../types/app';

export const thirdPartyApp = new Elysia({
  name: 'thirdPartyApp',
}).onBeforeHandle(({ request: req, log }: CustomContext) => {
  if (req?.ssrContext?.bootstrap?.cdn) {
    try {
      const cacheKey = `${CacheKeys.ThirdPartyAppsVersion}_${process.env.ENV}`;
      // plugin cache, anh thanh in charge
      //   const version = await fastify.cache.hget(cacheKey, req.storeClass);
      const version = true;
      if (version) {
        req.ssrContext.bootstrap.cdn.app_version = version;
        return;
      }

      const manifestPath = rootPath.resolve('manifestApps.json');
      if (!fs.existsSync(manifestPath)) {
        log?.debug({ manifestPath }, 'Manifest apps not exists');
        return;
      }

      const manifest = require(manifestPath);
      if (manifest && manifest.version) {
        req.ssrContext.bootstrap.cdn.app_version = manifest.version;
      }
    } catch (err) {
      log?.debug(err, 'Get app version error');
    }
  }
});
