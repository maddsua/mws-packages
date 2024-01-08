
export class TypedResponse<
	D extends object | null = null,
	H extends Record<string, string> | undefined = undefined,
	S extends number | undefined = undefined
> {

	data: D;
	headers?: H;
	status?: S;

	constructor(data: D, init?: {
		headers?: H;
		status?: S;
	}) {
		this.data = data;
		this.headers = init?.headers;
		this.status = init?.status;
	}

	toResponse(): Response {
		const body = this.data ? JSON.stringify(this.data) : null;
		const headers = new Headers(this.headers);
		if (this.data) headers.set('content-type', 'application/json');
		return new Response(body, { headers, status: this.status });
	}
};