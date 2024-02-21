
export const getUrlStringPath = (url: string) => {
	try { return new URL(url).pathname }
		catch(_) { return '/' }
};

export const trimProcedureName = (procedurePath: string) => {
	
	let nameStartIdx = 0;

	for (let idx = nameStartIdx; idx < procedurePath.length; idx++) {
		if (procedurePath[idx] != '/') {
			nameStartIdx = idx;
			break;
		}
	}

	let nameEndIdx = procedurePath.length;
	for (let idx = nameEndIdx - 1; idx > 0; idx--) {
		if (procedurePath[idx] != '/') {
			nameEndIdx = idx + 1;
			break;
		}
	}

	return procedurePath.slice(nameStartIdx, nameEndIdx);
};
