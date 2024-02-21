import { InferRouterSchema } from "../lib/router.ts";
import { TypedFetchServer } from "../server/instance.ts";
import helloworld from "./routes/helloworld.ts";

const routes = {
	helloworld,
};

export type RouterType = InferRouterSchema<typeof routes>;

const server = new TypedFetchServer({
	routerURL: '/api/'
}, routes);

console.log('Instance base path:', server.basePath);

Deno.serve({
	port: 8081,
}, async (request, info) => (await server.handle(request, info)).response);
