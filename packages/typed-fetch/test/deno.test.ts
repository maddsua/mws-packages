import { TypedResponse } from "../lib/api/response.ts";

type ApiResponseType = TypedResponse<{
	data: number;
}, {
	'x-test': 'test'
}, 200> | TypedResponse<{
	error_text: string;
}, {
	'x-test': 'test'
}, 400>;

const handler = (): ApiResponseType => {
	return new TypedResponse({
		data: 123
	}, {
		headers: {
			'x-test': 'test'
		},
		status: 200
	});
};
