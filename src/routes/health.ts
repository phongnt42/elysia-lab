import Elysia from 'elysia';

export const healthCheck = new Elysia({ name: 'healthCheck' }).get(
  '/health-check',
  ({set}) => {
    set.status = 200;
    return `I'm ok`;
  }
);
