import type { FetchSchema } from "./schema.ts";
import type { TypedRequest, TypedResponse } from "./rest.ts";

type InferResponse <T extends FetchSchema<any>> = TypedResponse<
	T['response']['data'],
	T['response']['headers'],
	T['response']['status']
>;

type HandlerResponseType <T extends FetchSchema<any>> = InferResponse<T> | T['response'];

type TypedHandlerResponse <T extends FetchSchema<any>> = HandlerResponseType<T> | Promise<HandlerResponseType<T>>;

export type TypedHandler <T extends FetchSchema<any>, C extends object = {}> = (request: TypedRequest<T['request']>, context: C) => TypedHandlerResponse<T>;
