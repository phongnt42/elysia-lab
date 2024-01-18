import Elysia from 'elysia';
const port = Number(process.env.PORT) || 3333;
const app = new Elysia().get('/', () => 'hi');

app.listen(port);

console.log(`Listening on http://${app.server!.hostname}:${app.server!.port}`);