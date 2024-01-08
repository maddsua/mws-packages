import "https://deno.land/std@0.210.0/dotenv/load.ts";
import { EventAggregator } from "../lib/index.ts";

const token = Deno.env.get('LOGPUSH_TEST_CREDS');

if (!token) throw new Error('$LOGPUSH_TEST_CREDS not defined');

const logpush = new EventAggregator({
	credentials: token,
	api_name: 'test api',
	reflectInLogs: false
});

logpush.log('test event');

console.log(logpush);
