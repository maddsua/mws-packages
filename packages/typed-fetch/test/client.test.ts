
import { TypedFetchAgent } from "../client/agent.ts";
import type { RouterType } from "./server.test.ts";

const agent = new TypedFetchAgent<RouterType>({
	endpoint: 'http://localhost:8081/api/'
});

const statusResult = await agent.query.helloworld();

console.log('[Test result] Message:', statusResult.data.message);

const postOrderResult = await agent.query.post_order({
	data: {
		person: 'maddsua',
		product_ids: ['gf-rtx-2060'],
		total: 400
	}
});

console.log('[Test 2 result] Post status:', postOrderResult.status);
