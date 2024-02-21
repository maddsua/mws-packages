import { FetchSchema } from "../../lib/schema.ts";
import { TypedHandler } from "../../lib/handlers.ts";
import { TypedResponse } from "../../lib/rest.ts";
import { TypedRouteContext } from "../../lib/router.ts";

type Schema = FetchSchema<{
	response: {
		data: {
			success: boolean;
			message: string;
		}
	}
}>;

export const handler: TypedHandler<Schema> = () => {
	return new TypedResponse({
		success: true,
		message: 'Hello world!'
	});
};

export default {
	handler
} satisfies TypedRouteContext
