import { InferRouterSchema } from "../lib/router.ts";
import { TypedFetchServer } from "../server/instance.ts";
import helloworld from "./routes/helloworld.ts";
import post_order from "./routes/post_order.ts";

const routes = {
	helloworld,
	post_order,
};

export type RouterType = InferRouterSchema<typeof routes>;

const server = new TypedFetchServer<RouterType, Deno.ServeHandlerInfo>({
	routerURL: '/api/'
}, routes);

console.log('Instance base path:', server.basePath);

Deno.serve({
	port: 8081,
}, async (request, info) => (await server.handle(request, info)).response);
