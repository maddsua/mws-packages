import {
	TypedResponse,
	TypedRequest,
	InferRequestType,
	requestToTyped
} from "../mod.ts";

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
		value: 123
	}, {
		headers: {
			'x-test': 'test'
		},
		status: 200
	});
};

const result = handler();

if (result.status === 200) {
	result.data.value
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
