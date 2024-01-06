This repo contains multiple tools to help with web stuff without installing 3 fucking hundred tons of dependency packages.

---

## NPM Packages

- ## Analytics Client

	A client for Google Analytics and Facebook Pixel.
	
	Provides typing and importable functions to push events without jumping all the hoops with global `fbq()` and `gtag()`
	
	[📦 npm link](https://www.npmjs.com/package/@maddsua/analytics-client)

- ## Logpush Client

	Provides a typescript API to push events to logpush service.

	For now only supabase is supported as it's backend. Pocketbase and standalone SQLite service are planned to be added soon. Like maybe this year xD.
	
	It just works as a remote console and is handy in case you're a cheapass and want to save Cloudflare Workers logs on the free plan 💀.

	[📦 npm link](https://www.npmjs.com/package/@maddsua/logpush-client)

- ## Captcha client
	
	Provides a nice way to load and execute recaptcha in a browser

	[📦 npm link](https://www.npmjs.com/package/@maddsua/captcha-client)

- ## Captcha server
	
	Typescript library to validate recaptcha tokens severside. Because calling fetch directly is not noice unuff.

	[📦 npm link](https://www.npmjs.com/package/@maddsua/captcha-server)

- ## Cloudflare Mailchannels API
	
	TypeScript API for Mailchannels on Cloudflare Workers

	[📦 npm link](https://www.npmjs.com/package/@maddsua/cf-mailchannels-api)


- ## Reveal
	
	Reveal-on-scroll animations using motion parameters

	[📦 npm link](https://www.npmjs.com/package/@maddsua/reveal)
