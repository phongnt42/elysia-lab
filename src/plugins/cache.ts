import Elysia from 'elysia';
import { Redis } from '../service/http.service';
import { logger } from '@bogeychan/elysia-logger';
import { Debug } from '../cache';

export const cache = new Elysia({ name: 'cache' })
  .use(
    logger({
      level: 'error',
    })
  )
  .derive(({ log }) => {
    let cache;
    if (process.env.CACHE_PROVIDER === 'redis') {
      try {
        cache = new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT || 6379),
        });
      } catch (err) {
        log.error(err, 'Connect redis');
      }
    }

    if (!cache) {
      cache = new Debug(log);
    }
    return { cache };
  });
