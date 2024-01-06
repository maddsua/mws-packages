import { TokenAuthClient, TokenAuthServer, generateToken } from "../lib/tokenAuth.ts";

Deno.test('Create secret, create and validate bearer', async () => {

	const secret = generateToken('motherfuckerproof');
	console.log('secret:', secret);
	
	const client = new TokenAuthClient({ secret: secret });
	const bearer = await client.getBearer();
	
	const server = new TokenAuthServer({ secret: secret });
	const validated = await server.validateBearer(bearer);
	if (!validated) throw new Error('failed to validate token')
	
});
