
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type Direction = 'x' | '-x' | 'y' | '-y';

export interface Translate {
	direction: Direction;
	amountEm: number;
};

export interface RevealParams {
	threshold: number;			//	t25 - reveal threshold in persents
	delay: number;				//	d125 - animation delay
	length: number;				//	l250 - animation length
	translate?: Translate;		//	tl2 - transform
	index?: number;				//	i5 - reveal order
};

export interface RevealElement {
	elem: HTMLElement;
	params: RevealParams;
}

export interface RevealParentElement extends RevealElement {
	inheritParams: RevealParams;
	children: RevealElement[];
};
