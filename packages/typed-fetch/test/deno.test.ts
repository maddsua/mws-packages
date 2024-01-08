import { TypedResponse } from "../lib/api/response.ts";
import { TypedRequest } from "../lib/api/request.ts";

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

type RequestType = TypedRequest<{
	query: string;
}, {
	'x-captcha': string;
}>;

const testRequest: RequestType = new TypedRequest('/api', {
	data: {
		query: 'data'
	},
	headers: {
		'x-captcha': 'token'
	}
});

const testResult = await testRequest.typedFetch<ApiResponse>();
