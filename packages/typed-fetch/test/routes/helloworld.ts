import { FetchSchema } from "../../lib/schema.ts";
import { TypedHandler } from "../../lib/handlers.ts";
import { TypedResponse } from "../../lib/rest.ts";

type Schema = FetchSchema<{
	response: {
		data: {
			success: boolean;
			message: string;
		}
	}
}>;

export const handler: TypedHandler<Schema, Deno.ServeHandlerInfo> = (request, context) => {

	console.log('Request from:', context.remoteAddr.hostname, new URL(request.url).pathname);

	return new TypedResponse({
		success: true,
		message: 'Hello world!'
	});
};

export default {
	handler
};
