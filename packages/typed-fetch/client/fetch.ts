import { type ErrorResponse, errorCodeHeader, ProcedureError, ErrorCodes, TypedFetchAPI_ID } from "../lib/api.ts";
import type { FetchSchema, TypedRequestInit } from "../lib/schema.ts";

export interface ResponseMetadata {
	ok: boolean;
};

const unwrapResponse = async <T extends FetchSchema<any>> (response: Response): Promise<T['response'] & ResponseMetadata> => {

	const contentIsJSON = response.headers.get('content-type')?.toLowerCase()?.includes('json');
	const responseData = contentIsJSON ? await response.json().catch(() => null) : null;
	if (contentIsJSON && !responseData) throw new Error('Invalid typed response: no data');

	return {
		data: responseData,
		headers: Object.fromEntries(response.headers.entries()),
		status: response.status,
		ok: response.ok
	};
};

type TypedFetchType = <T extends FetchSchema<any>> (
	url: string | URL,
	...args: (T['request'] extends object ? [T['request']] : [undefined?])
) => Promise<T['response']>;

export const typedFetch: TypedFetchType = async (url, init?: TypedRequestInit) => {

	let requestURL = url;

	if (init?.query) {

		const assembleSearchQuery = (params?: URLSearchParams) => {
			if (!params) params = new URLSearchParams();
			for (const key in init.query) params.set(key, init.query[key]);
			return params;
		};
	
		if (typeof requestURL === 'string') {
	
			const searchStarts = requestURL.indexOf('?');
			const requestSearch = assembleSearchQuery();
			
			if (requestSearch.size) {
				requestURL += searchStarts === -1 ? '?' : '&' + requestSearch.toString();
			}
	
		} else {
			assembleSearchQuery(requestURL.searchParams);
		}
	}

	const request = new Request(requestURL, {
		method: init?.data ? 'POST' : 'GET',
		headers: init?.data ? Object.assign({
			'content-type': 'application/json'
		}, init?.headers || {}) : init?.headers,
		body: init?.data ? JSON.stringify(init?.data) : null
	});

	const response = await fetch(request);

	if (response.headers.get(TypedFetchAPI_ID.header) != TypedFetchAPI_ID.value) {
		throw new Error(`Response is not a valid typed API response (${TypedFetchAPI_ID.header} header is missing or invalid)`);
	}

	const errorCode = response.headers.get(errorCodeHeader);
	if (errorCode) {
		const errorResponse: ErrorResponse | null = await response.json().catch((_) => null);
		throw new ProcedureError(errorResponse?.error_text || 'Unknown typed API error', parseInt(errorCode) as ErrorCodes);
	}

	return await unwrapResponse(response);
};
