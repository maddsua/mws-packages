import { ErrorCodes, type ErrorResponse, errorCodeHeader } from "../lib/api.ts";

const errorCodeMap: Record<ErrorCodes, number> = {
	[ErrorCodes.InvalidPath]: 400,
	[ErrorCodes.ProcedureNotFound]: 404,
	[ErrorCodes.HandlerError]: 500,
};

export const makeErrorResponse = (message: string, code: ErrorCodes) => {

	const responseData: ErrorResponse = {
		error_text: message,
		error_code: code
	};

	return new Response(JSON.stringify(responseData), {
		status: errorCodeMap[code] || 400,
		headers: {
			'content-type': 'application/json',
			[errorCodeHeader]: errorCodeMap[code].toString()
		}
	});
};
