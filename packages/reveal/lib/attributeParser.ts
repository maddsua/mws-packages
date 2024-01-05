import type { Direction, RevealParams, DeepPartial, Translate } from './types';

const translateDirectionMap: Record<string, Direction> = {
	't': '-y',
	'b': 'y',
	'l': '-x',
	'r': 'x'
};

export const defaultElementParams: RevealParams = {
	threshold: 25,
	delay: 125,
	length: 250,
	index: 0
};

export class AttributeParser {

	attr: string[];

	constructor(attribute: string | null) {
		this.attr = attribute?.toLowerCase()?.split(' ') || [];
	}

	getArg(expr: RegExp) {
		return this.attr.find(item => expr.test(item));
	}

	getArgTranslate(expr: RegExp): Partial<Translate> | undefined {

		const arg = this.getArg(expr);
		if (!arg) return undefined;

		const isCp = arg.startsWith('c');
		const numval = parseInt(arg.slice(isCp ? 3 : 2));

		return {
			amountEm: isNaN(numval) ? undefined : numval,
			direction: translateDirectionMap[isCp ? arg[2] : arg[1]]
		};
	}

	getArgInt(expr: RegExp): number | undefined {

		const arg = this.getArg(expr);
		if (!arg) return undefined;

		const numval = parseInt(arg.slice(arg.startsWith('c') ? 2 : 1));
		if (isNaN(numval)) return undefined;

		return numval;
	}

	parse(): DeepPartial<RevealParams> {
		return {
			threshold: this.getArgInt(/^t\d+$/),
			delay: this.getArgInt(/^d\d+$/),
			length: this.getArgInt(/^l\d+$/),
			translate: this.getArgTranslate(/^t[rltb]\d*$/),
			index: this.getArgInt(/^i\d+$/)
		};
	}

	parseChildren(): DeepPartial<RevealParams> {
		return {
			threshold: this.getArgInt(/^ct\d+$/),
			delay: this.getArgInt(/^cd\d+$/),
			length: this.getArgInt(/^cl\d+$/),
			translate: this.getArgTranslate(/^ct[rltb]\d*$/)
		};
	}
};
