import Elysia from 'elysia';
import rootPath from 'app-root-path';
import { createRequire } from 'module';
import { logger } from '@bogeychan/elysia-logger';

const isProd = process.env.NODE_ENV === 'production';
const require = createRequire(import.meta.url);

const addHook = () => {
  const theme = new Elysia({ name: 'theme' }).use(
    logger({
      level: 'error',
    })
  );

  if (isProd) {
    theme.onBeforeHandle(async ({ request: req, log }) => {
      if (!req?.ssrContext.state?.theme) {
        return;
      }

      const { version_id: versionId } = req.ssrContext.state.theme;

      try {
        const pkgPath = `@themes/theme-${versionId}`;
        const manifest = require(`${pkgPath}/manifest.json`);
        req.ssrContext.theme = require(pkgPath).default.plugin;
        req.ssrContext.state.theme.cdn.style = manifest.style;
        req.ssrContext.state.theme.cdn.javascript = manifest.javascript;
        req.ssrContext.state.theme.cdn.checkout_style = '';
        return;
      } catch (err) {
        log.error(err, 'Theme not exists');
        return;
      }
    });
  } else {
    theme.onBeforeHandle(({ request: req, log }) => {
      if (!req?.ssrContext?.state?.theme) {
        return;
      }

      const theme = req.ssrContext.state.theme;
      const pkgPath = rootPath.resolve(`dist/themes/${theme.handle}/ssr`);

      try {
        const manifest = require(`${pkgPath}/manifest.json`);
        req.ssrContext.theme = require(`${pkgPath}/server.js`).default.plugin;
        req.ssrContext.state.theme.cdn.javascript = manifest.javascript;
      } catch (err) {
        log.error(err, 'Theme not exists');
        return;
      }

      try {
        if (!req.ssrContext.isCheckout) {
          req.ssrContext.state.shop.locale.content = require(`${pkgPath}/default.json`);
        }
      } catch (err) {
        req.ssrContext.state.shop.locale.content = {};
        log.debug(err, 'Theme locale not exist');
      }
    });
  }
  return theme;
};

export const theme = addHook();
