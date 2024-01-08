import { TypedResponse } from "./response";

export class TypedRequest<
	D extends object | null = null,
	H extends Record<string, string> | undefined = undefined,
> {

	url: string | URL;
	headers?: H;
	data?: D;

	constructor(url: string | URL, init?: {
		headers?: H;
		data?: D;
	}) {
		this.url = url;
		this.data = init?.data;
		this.headers = init?.headers;
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
