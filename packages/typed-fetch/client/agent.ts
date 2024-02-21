import type { RouterSchema } from "../lib/router.ts";
import type { FetchSchema } from "../lib/schema.ts";
import type { TypedRequestInit } from "../lib/schema.ts";
import { typedFetch } from "./fetch.ts";

interface AgentConfig {
	endpoint: string;
};

type QueryReponse <T extends FetchSchema<any>> = Promise<T['response']>;
type QueryAction <T extends FetchSchema<any>> = T['request'] extends object ? (opts: T['request']) => QueryReponse<T> : () => QueryReponse<T>;
type RouterQueries <T extends RouterSchema<Record<string, FetchSchema<any>>>> = { [K in keyof T]: QueryAction<T[K]> };

export class TypedFetchAgent <T extends RouterSchema<Record<string, FetchSchema<any>>>> {

	cfg: AgentConfig;
	query: RouterQueries<T>;

	constructor(init: AgentConfig) {

		this.cfg = init;

		const queryHandler = (_: never, prop: string) => async (opts?: TypedRequestInit) => {

			const { endpoint } = this.cfg;
			const requestEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
			const requestPath = prop.slice(prop.startsWith('/') ? 1 : 0, prop.endsWith('/') ? -1 : undefined);

			return await typedFetch(`${requestEndpoint}/${requestPath}`, {
				headers: opts?.headers,
				data: opts?.data,
				query: opts?.query
			});
		};

		this.query = new Proxy({}, {
			get: queryHandler
		}) as RouterQueries<T>;
	}
};
