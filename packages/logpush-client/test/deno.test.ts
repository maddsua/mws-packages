import "https://deno.land/std@0.210.0/dotenv/load.ts";
import { EventAggregator } from "../lib/index.ts";

const token = Deno.env.get('LOGPUSH_TEST_CREDS');
if (!token) throw new Error('$LOGPUSH_TEST_CREDS not defined');

const logpush = new EventAggregator({
	creds: token,
	api_name: 'test api',
	reflectInLogs: false
});

logpush.log('test event');

console.log(logpush);

/*
const logpush2 = new EventAggregator({
	creds: {
		remote: 'https://api.example.com/push',
		token: 'test token',
		app_id: 'test app 2'
	},
	api_name: 'test api 2',
	reflectInLogs: false
});

logpush2.log('test event');

console.log(logpush2);
*/