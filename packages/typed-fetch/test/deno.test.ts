import { TypedResponse } from "../lib/api/response.ts";

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
	result.body.data
}

type ApiResponse = ReturnType<typeof handler>;
