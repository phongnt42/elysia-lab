import Elysia, { Context } from "elysia";
import { renderEndpoint } from "./plugins/renderEndpoint";

const port = Number(process.env.PORT) || 3000;

const handleRenderEndpoint = ({ request }: Context) => {
  return `Bel2lo: ${request.renderEndpoint}`;
};
const app = new Elysia().use(renderEndpoint).get('*', handleRenderEndpoint);

app.listen(port);
console.log(`Listening on http://${app.server!.hostname}:${app.server!.port}`);