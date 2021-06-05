# Migration from Vue 2 to Vue 3: Beta
Now it's work only for .js files
In the future it will support .ts, single-file-components

## Install
Use **-g** flag!
```
npm i -g vue2-to-3
```

### Example

HelloWorld.js
```
export default {
  name: 'HelloWorld',
  data: () => ({
    some: 0,
    another: 0,
    foo: ['potato'],
  }),
  methods: {
    somePlus() {
      this.some++;
    },
    anotherPlus() {
      this.another++;
    },
  },
};
```
Run in console:
```
migrate ./src/components/HelloWorld.js
```

### Result:

HelloWorld.js
```
import { reactive } from 'vue';

import { CompositionSome } from './CompositionSome.js'
import { CompositionAnother } from './CompositionAnother.js'

export default {
  name: 'HelloWorld',
  setup() {
    const _CompositionSome = CompositionSome();
    const _CompositionAnother = CompositionAnother();
    const foo = reactive(['potato']);
    return {
      foo,
      some: _CompositionSome.some,
      somePlus: _CompositionSome.somePlus,
      another: _CompositionAnother.another,
      anotherPlus: _CompositionAnother.anotherPlus,
    };
  },
};
```
Divided compositions:

CompositionSome.js
```
import { reactive } from 'vue';

export const CompositionSome = () => {
  const some = reactive(0);
  const somePlus = () => { some++ };
  return {
    some,
    somePlus,
  };
};
```
CompositionAnother.js
```
import { reactive } from 'vue';

export const CompositionAnother = () => {
  const another = reactive(0);
  const anotherPlus = () => { another++ };
  return {
    another,
    anotherPlus,
  };
};
```


### Contact

##### [id@ildar.dev](mailto:id@ildar.dev)
##### [telegram](https://t.me/ildardev)

