# es-state

Vue-like ref() but not bound to any specific framework. Persistent in local/session storage or cookie

## Usage example

```javascript
//  shared_module.js
import { PersistentStateRef } from '@maddsua/es-state';
export const editorSession = new PersistentStateRef(null, 'editor_session_data');
```

```javascript
//  module_A.js
import { editorSession } from './shared_module.js';
editorSession.watch((value) => console.log('Session data was updated:', value));
```


```javascript
//  module_B.js
import { editorSession } from './shared_module.js';
//  pretend that it's fetching some data
setTimeout(() => {
  editorSession.value = {
    username: 'name',
    rights: 'all',
    rizz: 'none'
  };
}, 1000);
```

Note: if you're using `PersistentStateRef` in a framework that utilizes island architecture or some other form of delayed hydration, you need to call `hydrate()` method after you are sure that client is ready to provide access to storage or cookies.
Otherwise, the state will fall back to it's default value
