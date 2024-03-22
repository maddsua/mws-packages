
declare let window: Window & {
    grecaptcha?: {
		ready(callback: () => void): void;
		execute(siteKey: string, action: { action: string }): Promise<string>;
	}
};

interface LoadOptions {
	render: string;
	onload?: string;
}

/**
 * Load recaptcha script
 */
export const loadReCaptcha = (options: LoadOptions) => {

	const recaptchaEndpoint = 'https://www.google.com/recaptcha/api.js'
	const scriptURL = new URL(recaptchaEndpoint);

	for (let key in options) {
		scriptURL.searchParams.set(key, options[key as keyof LoadOptions] as string);
	};

	const scriptAdded = Array.from(document.head.querySelectorAll<HTMLScriptElement>('script')).some((item) => item.src.startsWith(recaptchaEndpoint));

	if (scriptAdded || window.grecaptcha) {
		console.log('reCAPTCHA already loaded 👍')
		return false;
	}

	const recaptchaScript = document.createElement('script');
		recaptchaScript.src = scriptURL.href;
		recaptchaScript.async = true;
	document.head.appendChild(recaptchaScript);

	return true;
}


interface ExecuteV3Options {
	action?: string;
	maxLoadingWaitTimeS?: number;
}

/**
 * Execute invisible v3 challenge
 */
export const executeReCaptchaV3 = (secretKey: string, options?: ExecuteV3Options) => new Promise<string>(async (resolve, reject) => {

	const waitForReadyS = options?.maxLoadingWaitTimeS || 5;
	const retryTimeout = 1000;
	const rejectAfterNotLoadedAt = new Date().getTime() + waitForReadyS * 1000;

	while (!window.grecaptcha?.ready && new Date().getTime() < rejectAfterNotLoadedAt) {
		console.warn('Waiting for recaptcha...');
		await new Promise<void>(resolve => setTimeout(resolve, retryTimeout));
	}

	if (!window.grecaptcha?.ready) {
		reject('Failed to load recaptcha script');
		return;
	}

	const executeCallback = () => window.grecaptcha!.execute(secretKey, {
		action: options?.action || 'submit'
	}).then(resolve).catch(reject);

	window.grecaptcha.ready(executeCallback);
});
