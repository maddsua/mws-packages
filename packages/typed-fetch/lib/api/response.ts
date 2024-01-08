
export class TypedResponse<
	B extends object | null = null,
	H extends Record<string, string> | undefined = undefined,
	S extends number | undefined = undefined
> {

body: B;
headers?: H;
status?: S;

constructor(body: B, init?: {
	headers?: H;
	status?: S;
}) {
	this.body = body;
	this.headers = init?.headers;
	this.status = init?.status;
}
};
