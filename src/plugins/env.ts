import Elysia from "elysia";

const envVariable = process.env.ENV || 'development';

export const env = new Elysia({ name: 'env' }).decorate({
    env: envVariable,
    envHash: envVariable.charAt(0)
})
