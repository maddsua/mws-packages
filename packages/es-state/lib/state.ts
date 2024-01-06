
export class StateRef<T> {

	_internal_value: T;
	_watchers: Array<(newValue: T) => void> = [];

	constructor(initValue: T) {
		this._internal_value = initValue;
	};

	watch(watcher: (newValue: T) => void) {
		if (this._watchers.some(item => item === watcher)) return;
		this._watchers.push(watcher);
	};

	unwatch(watcher: () => void) {
		this._watchers = this._watchers.filter(item => item !== watcher);
	};

	get value() {
		return this._internal_value;
	};

	set value(newValue: T) {

		this._internal_value = newValue;

		this._watchers = this._watchers.filter(item => item);
		this._watchers.forEach(watcher => {
			try {
				watcher(this._internal_value);
			} catch (error) {
				console.error('StateRef watcher crashed:', error);
			}
		});
	};
};
