import type { FetchSchema } from "./schema.ts";
import { TypedHandler } from "./handlers.ts";

export interface TypedRouteContext <T extends FetchSchema<any> = any, C extends object = {}> {
	handler: TypedHandler<T, C>;
};

export type RouterSchema <T extends Record<string, Partial<FetchSchema<any>>>> = {
	[K in keyof T]: {
		request: T[K]['request'] extends object ? T[K]['request'] : undefined;
		response: T[K]['response'] extends object ? T[K]['response'] : undefined;
	}
};

export type TypedRouter <T extends RouterSchema<Record<string, FetchSchema<any>>>, C extends object = {}> = {
	[K in keyof T]: TypedRouteContext<T[K], C>;
};

type ExtractRouterSchema <T extends TypedRouteContext> = T['handler'] extends TypedHandler<infer U> ? U : never;
type RemoveNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

export type InferRouterSchema <T extends Record<string, TypedRouteContext<any, any>>> = RemoveNever<{
	[K in keyof T]: T[K] extends TypedRouteContext ? FetchSchema<{
		request: ExtractRouterSchema<T[K]>['request'];
		response: ExtractRouterSchema<T[K]>['response'];
	}> : never;
}>;
