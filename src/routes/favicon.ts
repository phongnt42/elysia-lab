import fs from 'fs';
import path from 'path';
import { path as rootPath } from 'app-root-path';
import Elysia from 'elysia';

const isProd = process.env.NODE_ENV === 'production';
const pluginCreator = () => {
  const basePath = isProd ? rootPath : path.resolve(__dirname, '..');
  const stream = fs.createReadStream(
    path.resolve(basePath, 'public/favicon.png')
  );
  const favicon = new Elysia({ name: 'favicon' });
  favicon.get('/favicon.png', ({ set }) => {
    set.headers['Content-Type'] = 'image/x-icon';
    return stream;
  });
  favicon.get('/favicon.ico', ({ set }) => {
    set.headers['Content-Type'] = 'image/x-icon';
    return stream;
  });
  return favicon;
};
export const favicon = pluginCreator();
