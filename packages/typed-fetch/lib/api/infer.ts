import { TypedRequest } from "./request";

export type InferRequestType<T extends {
	data?: object | null;
	headers?: Record<string, string>;
	method?: 'POST' | 'GET';
}> = TypedRequest<T['data'], T['headers'], T['method']>;

export const requestToTyped = async <T extends TypedRequest<any, any, any>> (request: Request) => {

	interface TypedInit {
		data: T['data'];
		headers: T['headers'];
		method: T['method'];
	};

	return new TypedRequest('', {
		data: await request.json(),
		headers: Object.fromEntries(request.headers.entries()),
		method: request.method
	} as TypedInit);
};
