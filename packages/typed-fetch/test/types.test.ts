import { TypedResponse } from "../lib/api/response.ts";
import { InferRequest, TypedRequest } from "../lib/api/request.ts";

const handler = () => {

	const variable = 2;

	if (!variable) {
		return new TypedResponse({
			error_text: 'fuuuuck'
		}, {
			status: 400
		});
	}

	return new TypedResponse({
		data: 123
	}, {
		headers: {
			'x-test': 'test'
		},
		status: 200
	});
};

const result = handler();

if (result.status === 200) {
	result.data.data
}

type ApiResponse = ReturnType<typeof handler>;

type RequestType = InferRequest<{
	data: {
		query: string;
	},
	headers: {
		'x-captcha': string;
	},
	method: 'GET'
}>;

const testRequest: RequestType = new TypedRequest('/api', {
	data: {
		query: 'data'
	},
	headers: {
		'x-captcha': 'token'
	},
	method: 'GET'
});

const testResult = await testRequest.typedFetch<ApiResponse>();

export const fromRequest = async <T extends TypedRequest<any, any, any>> (request: Request) => {

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

const restored = await fromRequest<RequestType>(new Request(''));

restored.data.query;
restored.headers["x-captcha"];
