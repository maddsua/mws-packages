import { createEnv } from "../mod.ts";

Deno.env.set('TEST_ENV_VAR', 'test');

const schema = {
	test: {
		name: 'TEST_ENV_VAR'
	}
} as const;

const env = createEnv(schema, Deno.env.toObject());

console.log(env);
