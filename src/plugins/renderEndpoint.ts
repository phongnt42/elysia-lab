import Elysia, { Context } from 'elysia';

declare global {
  interface Request {
    renderEndpoint?: string;
  }
}

export const renderEndpoint = new Elysia({
  name: 'render-endpoint',
}).onTransform(({ request: req }: Context) => {
  req.renderEndpoint = process.env.RENDER_ENDPOINT || 'http://localhost:3333';
  if (
    req.ssrContext?.bootstrap?.theme.customized &&
    process.env.RENDER_CUSTOMIZE_ENDPOINT
  ) {
    req.renderEndpoint = process.env.RENDER_CUSTOMIZE_ENDPOINT;
  }
});
