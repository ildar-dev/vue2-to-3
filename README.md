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

import { HelloWorldCompositionSome } from './HelloWorldCompositionSome.js'
import { HelloWorldCompositionAnother } from './HelloWorldCompositionAnother.js'

export default {
  name: 'HelloWorld',
  setup() {
    const _HelloWorldCompositionSome = HelloWorldCompositionSome();
    const _HelloWorldCompositionAnother = HelloWorldCompositionAnother();
    const foo = reactive(['potato']);
    return {
      foo,
      some: _HelloWorldCompositionSome.some,
      somePlus: _HelloWorldCompositionSome.somePlus,
      another: _HelloWorldCompositionAnother.another,
      anotherPlus: _HelloWorldCompositionAnother.anotherPlus,
    };
  },
};
```
Divided compositions:

CompositionHelloWorldSome.js
```
import { reactive } from 'vue';

export const CompositionHelloWorldSome = () => {
  const some = reactive(0);
  const somePlus = () => { some++ };
  return {
    some,
    somePlus,
  };
};
```
CompositionHelloWorldAnother.js
```
import { reactive } from 'vue';

export const CompositionHelloWorldAnother = () => {
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

