import { TypedResponse } from "./response";

export class TypedRequest<
	D extends object | null | undefined = undefined,
	H extends Record<string, string> | undefined = undefined,
	M extends 'POST' | 'GET' | undefined = undefined
> {

	url: string | URL;
	headers: H;
	data: D;
	method: M;

	constructor(url: string | URL, init?: {
		headers?: H;
		data?: D;
		method?: M;
	}) {
		this.url = url;
		this.data = init?.data as D;
		this.headers = init?.headers as H;
		this.method = init?.method as M;
	}

	toRequest() {
		return new Request(this.url, {
			method: 'POST',
			headers: this.headers,
			body: this.data ? JSON.stringify(this.data) : null
		});
	}

	async fetch() {
		return fetch(this.toRequest());
	}

	async typedFetch<R extends TypedResponse<object, Record<string, string>, number>>() {

		const response = await this.fetch();

		return new TypedResponse({
			data: await response.json().catch(() => null),
			headers: Object.fromEntries(Object.entries(response.headers)),
			status: response.status
		}) as R;
	}
};

export type InferRequest<T extends {
	data?: object | null;
	headers?: Record<string, string>;
	method?: 'POST' | 'GET';
}> = TypedRequest<T['data'], T['headers'], T['method']>;
