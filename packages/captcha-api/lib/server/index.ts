
export interface ValidationParams {
	secretKey: string;
	challenge: string;
	minScore?: string | number;
};

export type ValidationResult = {
	success: true;
	score?: number;
	error: null;
} | {
	success: false;
	score: number;
	error: null;
} | {
	success: false;
	error: Error;
};

export type APIResponse = {
	success: boolean;
	'error-codes'?: string[];
	score?: number;
	action?: string;
	challenge_ts?: string;
	hostname?: string;
};

/**
 * Validate reCAPTCHA
 */
export const validateReCaptcha = async (params: ValidationParams): Promise<ValidationResult> => {

	if (typeof params.challenge !== 'string') return {
		success : false,
		error: new Error('challenge token invalid')
	};

	const requestPayload = new URLSearchParams();
	requestPayload.set('secret', params.secretKey);
	requestPayload.set('response', params.challenge);

	const apiResponse = await fetch('https://google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: requestPayload.toString()
	}).then((data): Promise<APIResponse> => data.json()).catch(() => null);

	if (!apiResponse) {
		return { success: false, error: new Error('Invalid response from reCAPTCHA API: not a valid json') };
	}
	
	if (!apiResponse.success || apiResponse["error-codes"]?.length) {

		const errorText = apiResponse['error-codes']?.join(', ') ||
			'reCAPTCHA just returned a fail response for no reason';

		return { success: false, error: new Error(errorText) };
	}

	if (typeof params.minScore === 'number' && typeof apiResponse.score === 'number') {
		const scoreThreshold = (typeof params.minScore === 'string' ? parseFloat(params.minScore) : params.minScore) || 0.5;
		if (apiResponse.score < scoreThreshold) {
			return { success: false, score: apiResponse.score, error: null };
		}
	}

	return { success: true, score: apiResponse.score, error: null };
};
