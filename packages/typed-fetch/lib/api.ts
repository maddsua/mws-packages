
export enum ErrorCodes {
	InvalidPath = 1001,
	InvalidMethod = 1002,
	ProcedureNotFound = 1003,
	HandlerError = 1004,
};

export const TypedFetchAPI_ID = {
	header: 'x-api-id',
	value: 'maddsua/typedfetch'
};

export const errorCodeHeader = 'x-typedfetch-error';

export interface ErrorResponse {
	error_text: string;
	error_code: ErrorCodes
};

export class ProcedureError extends Error {
	
	code: ErrorCodes;

	constructor(message: string, code: ErrorCodes) {
		super(message);
		this.code = code;
	}
};
