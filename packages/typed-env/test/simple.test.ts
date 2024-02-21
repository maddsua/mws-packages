import { TypedEnv, createEnv } from "../mod.ts";

Deno.env.set('TEST_ENV_VAR', 'test');

const schema: TypedEnv = {
	test: {
		name: 'TEST_ENV_VAR'
	}
};

const env = createEnv(schema, Deno.env.toObject());

console.log(env);
