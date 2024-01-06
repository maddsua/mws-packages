
const createMessageString = (secret: string, date: Date) => `auth_message:${secret}:${date.toISOString()}`;

const hashString = async (message: string) => {
	const bytes = new TextEncoder().encode(message);
	const hashBytes = await crypto.subtle.digest('sha-256', bytes);
	return btoa(String.fromCodePoint(...new Uint8Array(hashBytes)));
};

const tokenLengthPresets = {
	'test': 4,
	'humane': 8,
	'willdo': 16,
	'prod': 32,
	'motherfuckerproof': 64,
	'nowayinhelluguessinthis': 128
};

export const generateToken = (length?: keyof typeof tokenLengthPresets | number) => {
	const generateLength = (typeof length === 'string' ? tokenLengthPresets[length] : length) || 24;
	const randomarray = new Uint8Array(generateLength + 3);
	crypto.getRandomValues(randomarray);
	return btoa(String.fromCodePoint(...randomarray)).slice(0, generateLength);
};

interface AuthClientInit {
	secret: string;
	timeframe?: number;
}

export class TokenAuthClient {

	secret: string;
	static timeframeMin = 5;
	static timeframeMax = 60;
	timeframe = 30;

	constructor(init: AuthClientInit) {

		if (!init.secret.length) throw new Error('Invalid client secret');

		this.secret = init.secret;

		if (typeof init?.timeframe === 'number') {
			if (init.timeframe < TokenAuthClient.timeframeMin || init.timeframe > TokenAuthClient.timeframeMax) {
				throw new Error(`Timeframe value should be in range ${TokenAuthClient.timeframeMin}...${TokenAuthClient.timeframeMax}. Pick something more reasonable for it`);
			}
			this.timeframe = init.timeframe
		}
	}

	async getToken() {
		const framedEpoch = Math.floor(new Date().getTime() / (1000 * this.timeframe));
		const framedTime = new Date(framedEpoch * this.timeframe * 1000);
		return hashString(createMessageString(this.secret, framedTime));
	}

	async getBearer() {
		const token = await this.getToken();
		return `Bearer ${token}`;
	}

	async getHeader() {
		const bearer = await this.getBearer();
		return [ 'Authorization', bearer ];
	}

};


interface AuthServertInit extends AuthClientInit {
	timeCorrectionMp?: number;
}

export class TokenAuthServer {

	secret: string;
	static timeframeMin = 5;
	static timeframeMax = 60;
	timeframe = 30;
	timeCorrectionMp = 0.25;

	constructor(init: AuthServertInit) {

		if (!init.secret.length) throw new Error('Invalid client secret');

		this.secret = init?.secret;

		if (typeof init?.timeframe === 'number') {
			if (init.timeframe < TokenAuthServer.timeframeMin || init.timeframe > TokenAuthServer.timeframeMax) {
				throw new Error(`Timeframe value should be in range ${TokenAuthServer.timeframeMin}...${TokenAuthServer.timeframeMax}. Pick something more reasonable for it`);
			}
			this.timeframe = init.timeframe
		}

		if (typeof init?.timeCorrectionMp === 'number') {
			if (init.timeCorrectionMp > 1 || init.timeCorrectionMp < 0) {
				throw new Error('Time correction multiplier should be in range 0...1');
			}
			this.timeCorrectionMp = init.timeCorrectionMp;
		}
	}

	fakeDelay(range: number) {
		const fakeDelayTime = 250 + Math.round((Math.random() * range) + (Math.random() * 50))
		return new Promise(resolve => setTimeout(resolve, fakeDelayTime));
	}

	async validateToken(token: string) {

		const epochNow = new Date().getTime();
		const framedEpoch = Math.floor(epochNow / (1000 * this.timeframe));
		const timeWindowNow = framedEpoch * this.timeframe * 1000;
		const timeWindowPrev = (framedEpoch - 1) * this.timeframe * 1000;
		const timeWindowNext = (framedEpoch + 1) * this.timeframe * 1000;

		const frames = [
			{
				delta: 0,
				date: new Date(timeWindowNow)
			},
			{
				delta: epochNow - timeWindowPrev - (this.timeframe * 1000),
				date: new Date(timeWindowPrev)
			},
			{
				delta: epochNow - timeWindowNext,
				date: new Date(timeWindowNext)
			},
		];

		const validFrames = frames.filter(item => !item.delta || Math.abs(item.delta) / (this.timeframe * 1000) < this.timeCorrectionMp);
		const candidates = await Promise.all(validFrames.map(item => hashString(createMessageString(this.secret, item.date))));
		return candidates.some(item => item === token);
	}

	async validateBearer(bearerToken: string) {

		const token = bearerToken.replace(/^\s*bearer\s*/i, '');

		const success = await this.validateToken(token);
		if (success) return true;

		await this.fakeDelay(800);
		return false;
	}

	async validateAuth(headers: Headers) {
		const bearer = headers.get('authorization');
		if (!bearer) return false;
		return this.validateBearer(bearer);
	}
};
