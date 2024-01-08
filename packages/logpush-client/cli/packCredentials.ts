import "https://deno.land/std@0.210.0/dotenv/load.ts";

/*
const params = {
	remote: 'LOGPUSH_REMOTE',
	token: 'LOGPUSH_TOKEN',
	appid: 'LOGPUSH_APPID'
};

for (const key in params) {
	const envVariable = params[key as keyof typeof params];
	const envValue = Deno.env.get(envVariable);
	if (!envValue) throw new Error(`Variable $${envVariable} is not defined`);
	params[key as keyof typeof params] = envValue;
}

console.log(btoa(JSON.stringify(params)));
*/

const staticKeyEntries = [
	'LOGPUSH_REMOTE',
	'LOGPUSH_TOKEN',
	'LOGPUSH_APPID'
];

const staticString = staticKeyEntries.map(item => {
	const envValue = Deno.env.get(item);
	if (!envValue) throw new Error(`Variable $${item} is not defined`);
	return envValue;
}).map(item => btoa(item).replace(/\=+$/, '')).join('.');

console.log('Static credentials string:', staticString);
