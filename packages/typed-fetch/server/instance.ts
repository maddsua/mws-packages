import { ErrorCodes, TypedFetchAPI_ID } from "../lib/api.ts";
import { TypedRequest, TypedResponse, serializeResponseObject } from "../lib/rest.ts";
import type { RouterSchema, TypedRouter } from "../lib/router.ts";
import { FetchSchema, TypedResponseInit } from "../lib/schema.ts";
import { makeErrorResponse } from "./responses.ts";
import { getUrlStringPath, trimProcedureName } from "./url.ts";

interface InstanceInitData {
	routerURL: string | URL;
};

interface InvocationResult {
	response: Response;
	error?: Error;
	handlerError?: Error;
};

export class TypedFetchServer<T extends RouterSchema<Record<string, FetchSchema<any>>>, C extends object = {}> {

	basePath: string;
	routes: TypedRouter<T, C>;

	constructor(init: InstanceInitData, routes: TypedRouter<T, C>) {

		const instancePath = typeof init.routerURL === 'object' ? init.routerURL.pathname : init.routerURL;
		this.basePath = (instancePath.length > 1 && instancePath.endsWith('/')) ?
			instancePath.slice(0, -1) : (instancePath.length > 0 ?
				instancePath : '/');

		this.routes = routes;
	}

	async handle(request: Request, context: C): Promise<InvocationResult> {

		const requestPath = getUrlStringPath(request.url);
		if (!requestPath.startsWith(this.basePath)) {
			return {
				response: makeErrorResponse('wrong base path', ErrorCodes.InvalidPath),
				error: new Error(`Wrong base path: url "${request.url}" is not under the base path "${this.basePath}"`)
			};
		}
		
		const procedurePath = requestPath.slice(this.basePath.length);
		const procedureName = trimProcedureName(procedurePath);

		const procedureCtx = this.routes[procedureName];
		if (!procedureCtx) {
			return {
				response: makeErrorResponse('procedure not found', ErrorCodes.ProcedureNotFound),
				error: new Error(`Procedure "${procedureName}" not found`)
			};
		}

		try {

			const procCallResult: TypedResponseInit | TypedResponse<any, any, any> =
				await procedureCtx.handler(new TypedRequest(request), context);

			const procResponse = 'toResponse' in procCallResult ? procCallResult?.toResponse() :
				serializeResponseObject(procCallResult);

			procResponse.headers.set(TypedFetchAPI_ID.header, TypedFetchAPI_ID.value);

			return { response: procResponse };

		} catch (error) {

			console.error('Procedure handler crashed:', (error as Error | null)?.message || error);
			return {
				response: makeErrorResponse('procedure crashed', ErrorCodes.HandlerError),
				error: new Error('Handler has crashed'),
				handlerError: error instanceof Error ? error : new Error((error as Error | null)?.message || JSON.stringify(error))
			};
		}
	}
};
