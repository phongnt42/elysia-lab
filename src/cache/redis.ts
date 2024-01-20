import type { RedisClient, ClientOpts } from 'redis';
import { Cache, SetCacheOptions } from '../types';
import { useCallbacks, UseCallbacks } from '@shopbase/shared';

export class Redis implements Cache {
  private client: RedisClient;
  private connected = false;
  private readyHandlers: UseCallbacks<any>;
  private ready = false;

  constructor(options: ClientOpts = {}) {
    this.client = require('redis').createClient(options);
    this.readyHandlers = <any>useCallbacks();
    this.listen();
  }

  isReady(): Promise<void> {
    if (this.ready) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.readyHandlers.add([resolve, reject]);
    });
  }

  listen(): void {
    this.client.on('connect', () => {
      this.connected = true;
    });

    this.client.on('end', () => {
      this.connected = false;
    });

    this.client.on('ready', () => {
      this.connected = true;
      this.markAsReady();
    });
  }

  async get(key: string): Promise<string> {
    if (this.connected) {
      return new Promise((resolve) => {
        this.client.get(key, (err, val) => {
          if (typeof val === 'string') {
            return resolve(val);
          }

          resolve('');
        });
      });
    }

    return Promise.resolve('');
  }

  set(key: string, val: string, ttl = 900, options: SetCacheOptions = { type: 'EX' }): void {
    if (this.connected) {
      this.client.set(key, val, options.type, ttl);
    }
  }

  hget(key: string, field: string): Promise<string> {
    if (this.connected) {
      return new Promise((resolve) => {
        this.client.hget(key, field, (err, val) => {
          if (typeof val === 'string') {
            return resolve(val);
          }

          resolve('');
        });
      });
    }

    return Promise.resolve('');
  }

  hset(key: string, field: string, value: string, ttl?: number, options?: SetCacheOptions): void {
    if (this.connected) {
      this.client.hset(key, field, value, (err) => {
        // trying to override hset for a type that is not a hashmap will get an error WRONG TYPE needs del before hset
        if ((err as any)?.code == 'WRONGTYPE') {
          this.client.del(key);
        }
      });
      this.client.expire(key, ttl || 900);
    }
  }

  expire(key: string, ttl: number): void {
    if (this.connected) {
      this.client.expire(key, ttl);
    }
  }

  del(key: string): void {
    if (this.connected) {
      this.client.del(key);
    }
  }

  hdel(key: string, field: string): void {
    if (this.connected) {
      this.client.hdel(key, field);
    }
  }

  private markAsReady(err?: any): void {
    if (this.ready) {
      return;
    }

    this.ready = true;
    this.readyHandlers.list().forEach(([resolve, reject]) => (err ? reject(err) : resolve()));
    this.readyHandlers.reset();
  }
}
