
import { TypedFetchAgent } from "../client/agent.ts";
import type { RouterType } from "./server.test.ts";

const agent = new TypedFetchAgent<RouterType>({
	endpoint: 'http://localhost:8081/api/'
});

const statusResult = await agent.query.helloworld();

console.log('[Test result] Message:', statusResult.data.message);
