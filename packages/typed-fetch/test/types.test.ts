import { TypedResponse } from "../lib/api/response.ts";
import { TypedRequest } from "../lib/api/request.ts";
import { InferRequestType, requestToTyped } from "../lib/api/infer.ts";

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

type RequestType = InferRequestType<{
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

const restored = await requestToTyped<RequestType>(new Request(''));

restored.data.query;
restored.headers["x-captcha"];
