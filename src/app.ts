import Elysia, { Context } from 'elysia';
import { renderEndpoint } from './plugins/renderEndpoint';
import { security } from './plugins/security';
import { storeClass } from './plugins/storeClass';
import { thirdPartyApp } from './plugins/thirdPartyApp';
import { theme } from './plugins/theme';
import { logger } from '@bogeychan/elysia-logger';
import { SSRContext } from './types/app';
import { http } from './plugins/http';

const port = Number(process.env.PORT) || 3000;
declare global {
  interface Request {
    ssrContext: SSRContext;
    http: any;
  }
}


const requestOptions = {
  method: 'POST',
  body: JSON.stringify({ key1: 'value1', key2: 'value2' }), // Replace with your actual data
};

const handleRenderEndpoint = ({ request }: Context) => {
  return `Bel2lo: ${request.renderEndpoint}`;
};

const app = new Elysia();

// plugins
app.use(renderEndpoint);
app.use(http);
app.use(security);
app.use(storeClass);
app.use(thirdPartyApp);
app.use(theme);
app.get('*', handleRenderEndpoint);

// listen
app.listen(port);

console.log(`Listening on http://${app.server!.hostname}:${app.server!.port}`);
