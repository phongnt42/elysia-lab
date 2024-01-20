import Elysia from 'elysia';
import { cache as cachePlugin } from '../plugins/cache';
import { logger } from '@bogeychan/elysia-logger';
import { CacheKeys } from '../constants';

const cache = new Elysia({ name: 'cache-route' })
  .use(
    logger({
      level: 'error',
    })
  )
  .use(cachePlugin);

cache.get(
  '/feature-switch',
  ({ cache, request }) => {
    cache.del(CacheKeys.FeatureSwitch);
    console.log('[Request]')
    return { success: true, test: request.exceptBootstrap };
  },
  {
    transform: ({ request }) => {
      console.log('[parse]');
      request.exceptBootstrap = true;
    },
  }
).onParse(({ request }) => {
  console.log('[onParse]');
});

export { cache };
