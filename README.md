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

export default {
  name: 'HelloWorld',
  setup() {
    const foo = reactive(['potato']);
    return {
      foo,
    };
  },
};
```
Divided compositions:

CompositionHelloWorldSome.js
```
import { reactive } from 'vue';

export default {
  name: 'CompositionHelloWorldSome',
  setup() {
    const some = reactive(0);
    const somePlus = () => { some++ };
    return {
      some,
      somePlus,
    };
  },
};
```
CompositionHelloWorldAnother.js
```
import { reactive } from 'vue';

export default {
  name: 'CompositionHelloWorldAnother',
  setup() {
    const another = reactive(0);
    const anotherPlus = () => { another++ };
    return {
      another,
      anotherPlus,
    };
  },
};
```


#### Contact
##### mail: **id@ildar.dev**
##### tg: **ildardev**


