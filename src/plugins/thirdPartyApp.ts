import Elysia from 'elysia';
import { CacheKeys } from '../constants';
import rootPath from 'app-root-path';
import fs from 'fs';
import { logger } from '@bogeychan/elysia-logger';
import { cache } from './cache';

export const thirdPartyApp = new Elysia({
  name: 'thirdPartyApp',
})
  .use(
    logger({
      level: 'error',
    })
  )
  .use(cache)
  .onBeforeHandle(async ({ request: req, log, cache }) => {
    if (req?.ssrContext?.bootstrap?.cdn) {
      try {
        const cacheKey = `${CacheKeys.ThirdPartyAppsVersion}_${process.env.ENV}`;
        // plugin cache, anh thanh in charge
        const version = await cache.hget(cacheKey, req.storeClass);
        // const version = true;
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
