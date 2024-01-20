import { path as rootPath } from 'app-root-path';
import path from 'path';
import { readFile } from '../types/app';
import Elysia from 'elysia';

const isProd = process.env.NODE_ENV === 'production';

const pluginCreator = async () => {
  const basePath = isProd ? rootPath : path.resolve(__dirname, '..');
  const defaultRobots = await readFile(
    path.resolve(basePath, 'public/robots.txt')
  );
  const robots = new Elysia({ name: 'robot' }).get(
    '/robots.txt',
    ({ request: req, set }) => {
      const domain =
        req?.ssrContext?.bootstrap?.navigation?.redirect?.domain || '';
      if (domain) {
        let robots = defaultRobots;
        if (req.ssrContext.bootstrap?.shop.robots_txt) {
          robots = req.ssrContext.bootstrap.shop.robots_txt.replace(
            '\\n',
            '\n'
          );
        }
        return robots.replace(/{primary_domain}/g, `https://${domain}`);
      }
      set.status = 404;
      return 'Page not found';
    }
  );
  return robots;
};
export const robots = pluginCreator();
