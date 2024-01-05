
interface SenderIdentity {
	email: string;
	name: string;
}

interface MailchannelsReponse {
	errors: string[];
}

interface SendOptions {
	sender: SenderIdentity;
	subject: string;
	recepients: string[];
	content: string;
}

const sendMailchannelsEmail = async (opts: SendOptions) => {

	const send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			subject: opts.subject,
			from: {
				email: opts.sender.email,
				name: opts.sender.name,
			},
			personalizations: [
				{
					to: opts.recepients.map(email => ({ email })),
				}
			],
			content: [
				{
					type: 'text/html',
					value: opts.content
				}
			]
		}),
	});

	const response = await fetch(send_request).catch(() => null);
	if (!response) throw new Error('Network error. Failed to contacts mailchannels.');

	if (response.ok) return;

	const responseText = await response.text();

	if (responseText.trim() === 'null') return;

	if (response.headers.get('content-type')?.includes('json')) {
		const jsonResponse = await new Promise<MailchannelsReponse>(resolve => resolve(JSON.parse(responseText))).catch(() => null);
		if (!jsonResponse) throw new Error(`Mailchannels API rejected: ${responseText}`);
		throw new Error(`Mailchannels API rejected: ${jsonResponse.errors.join('; ')}`);
	} else {
		throw new Error(`Mailchannels API rejected: ${responseText}`);
	}
};

const sendEmailNoExcept = async (opts: SendOptions): Promise<Error | null> => {

	try {
		await sendMailchannelsEmail(opts);
	} catch (error) {
		return error as Error;
	}

	return null;
};

export {
	sendMailchannelsEmail,
	sendMailchannelsEmail as sendEmail,
	sendEmailNoExcept
};
