
interface ValidationParams {
	secretKey: string;
	challenge: string;
	minScore?: string | number;
};

interface ValidationResult {
	success: boolean;
	score?: number;
	error?: Error;
};

type APIResponse = {
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
	
	if (!apiResponse.success) {
		const errorText = apiResponse['error-codes']?.join(', ');
		return { success: false, score: apiResponse.score, error: new Error(errorText) };
	}

	if (typeof params.minScore !== 'undefined' && typeof apiResponse.score === 'number') {
		const scoreThreshold = (typeof params.minScore === 'string' ? parseFloat(params.minScore) : params.minScore) || 0.5;
		if (apiResponse.score < scoreThreshold) {
			return { success: false, score: apiResponse.score };
		}
	}

	return { success: true, score: apiResponse.score };
};
