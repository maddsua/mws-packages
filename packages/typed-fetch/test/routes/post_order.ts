import { FetchSchema } from "../../lib/schema.ts";
import { TypedHandler } from "../../lib/handlers.ts";
import { TypedResponse } from "../../lib/rest.ts";

type Schema = FetchSchema<{
	request: {
		data: {
			person: string;
			product_ids: string[];
			total: number;
		}
	}
	response: {
		data: {
			error_code: string;
		},
		status: 400 | 500
	} | {
		data: null,
		status: 202
	}
}>;

export const handler: TypedHandler<Schema> = async (request) => {

	if (request.method != "POST") {
		return new TypedResponse({
			error_code: 'invalid request method'
		}, {
			status: 400
		});
	}

	const { data } = await request.unwrap();

	if (!data) {
		return new TypedResponse({
			error_code: 'no order data'
		}, {
			status: 400
		});
	}

	console.log('Order data:', data);

	return new TypedResponse(null, {
		status: 202
	});
};

export default {
	handler
}
