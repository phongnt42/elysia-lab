import Elysia from 'elysia';
import { LogLevels } from '../constants';
import { createHttp } from '../service/http.service';

const pluginCreator = () => {
  let endpoint = process.env.API_ENDPOINT || '';
  if (process.env.STORE_DOMAIN) {
    endpoint = `https://${process.env.STORE_DOMAIN}${
      process.env.VITE_API_ENDPOINT || ''
    }`;
  }
  const http = createHttp({
    endpoint: endpoint,
    debug: process.env.LOG_LEVEL === LogLevels.debug,
  });
    return new Elysia({ name: 'http' }).decorate({
        http: http,
        httpEndPoint: endpoint
  })
};

export const http = pluginCreator();

