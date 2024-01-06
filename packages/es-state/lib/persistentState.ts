
type StorageType = 'sessionStorage' | 'localStorage' | 'cookie';

/**
 * An absolutely overengineered solution but it looks nice when in use
 */
class CookieStorage {
	getItem(key: string) {
		const entries = document.cookie.split('; ').map(item => item.split('=', 2) as [string, string]);
		const cookie = entries.find(item => item[0] === key)?.[1];
		return cookie ? decodeURIComponent(cookie) : null;
	};
	setItem(key: string, value: string, expires?: Date) {
		const valueEncoded = encodeURIComponent(value);
		const cookieExpiration = expires || new Date(new Date().getTime() + 1_209_600_000);
		document.cookie = `${key}=${valueEncoded}; expires=${cookieExpiration.toUTCString()}; SameSite=Strict; Secure`;
	};
	removeItem(key: string) {
		this.setItem(key, '', new Date(0));
	};
};

export class PersistentStateRef<T> {

	_internal_value: T;
	_watchers: Array<(newValue: T) => void> = [];
	_storage_type: StorageType;
	_record_name: string;
	_storage?: Storage | CookieStorage;
	hydrated: boolean = false;

	constructor(initValue: T, record_name: string, type?: StorageType) {

		this._internal_value = initValue;
		this._storage_type = type || 'sessionStorage';
		this._record_name = record_name;

		this.hydrate();
	};

	/**
	 * Get data saved in storage
	 */
	readStorage() {

		try {
			let stateString = this._storage!.getItem(this._record_name);
			if (stateString) this._internal_value = JSON.parse(stateString);
		} catch (_error) {
			console.error(`Failed to restore PersistentStateRef for: "${this._record_name}"`);
			return false;
		}

		return true;
	}

	/**
	 * Write data to storage
	 */
	writeStorage() {

		try {

			if (this._internal_value !== null) {
				const stateString = JSON.stringify(this._internal_value);
				this._storage!.setItem(this._record_name, stateString);
			}
			else this._storage!.removeItem(this._record_name);

		} catch (_error) {
			console.error(`Failed to save PersistentStateRef for: "${this._record_name}"`);
			return false;
		}

		return true;
	}

	/**
	 * Call update callbacks on all listening watchers
	 */
	updateWatchers() {
		this._watchers = this._watchers.filter(item => item);
		this._watchers.forEach(watcher => {
			try {
				watcher(this._internal_value);
			} catch (error) {
				console.error('StateRef watcher crashed:', error);
			}
		});
	};

	/**
	 * Initializes storage when running client-side, otherwise does nothing
	 */
	hydrate() {

		if (typeof window == 'undefined') return false;

		switch (this._storage_type) {

			case 'cookie':
				this._storage = new CookieStorage();
				break;

			case 'localStorage':
				this._storage = localStorage;
				break;
			
			case 'sessionStorage':
				this._storage = sessionStorage;
				break;
		
			default: throw new Error('Unknown storage type');
		}

		const readResult = this.readStorage();
		if (readResult) {
			this.hydrated = true;
			this.updateWatchers();
			return true;
		}

		return false;
	};

	/**
	 * Manually sync state
	 */
	sync() {
		this.writeStorage();
		this.updateWatchers();
	}

	/**
	 * Get updates when state changes
	 */
	watch(watcher: (newValue: T) => void) {
		if (this._watchers.some(item => item === watcher)) return;
		this._watchers.push(watcher);
	};

	/**
	 * Stop getting state updates
	 */
	unwatch(watcher: () => void) {
		this._watchers = this._watchers.filter(item => item !== watcher);
	};

	/**
	 * State value
	 */
	get value() {
		return this._internal_value;
	};

	/**
	 * State value
	 * Please note that if state is an object an you change one of it's properties you'd need to call sync() after that as for now I did't implement any proxies
	 */
	set value(newValue: T) {
		this._internal_value = newValue;
		this.writeStorage();
		this.updateWatchers();
	};
};
