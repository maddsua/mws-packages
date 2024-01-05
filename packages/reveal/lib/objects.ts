
export function mergeNonNullish<T extends object, U extends object>(a: T, b: U) {

	const target = {} as T;

	for (let update of arguments) {

		for (const key in update) {

			let next = update[key];
			switch (typeof next) {
	
				case 'string':
					if (!next.length) continue;
					target[key as unknown as keyof T] = next as T[keyof T];
					break;
	
				case 'number':
					if (isNaN(next)) continue;
					target[key as unknown as keyof T] = next as T[keyof T];
					break;
	
				case 'object':
					if (next === null) continue;	
					target[key as unknown as keyof T] = mergeNonNullish(target[key as unknown as keyof T] as object || {}, next);
					break;
	
				default:
					break;
			}
		}
	};

	return target as T & U;
};
