import { toVue3HookName } from './utils/vue2';
import { EPropertyType, IComponent, IComponentVariable } from './types';

const splitter = '\n'

const hooks: string[] = [
  'mounted',
  'beforeCreate',
  'beforeDestroy',
  'beforeMount',
  'beforeUpdate',
  'created',
  'updated',
  'destroyed'
].map((_) => toVue3HookName(_))

const getProperties = (object: IComponent, type: EPropertyType): IComponentVariable[] => {
  return object.properties.filter(_ => _.type === type);
}

export const stringify = (object: IComponent): string => {
  const builder: string[] = []

  const buildFunctions = [
    addImportComponents,
    addImportVue,
    addOpen,
    addName,
    addComponents,
    addProps,
    addSetup,
    addClose
  ]

  buildFunctions.forEach(f => {
    builder.push(f(object));
  });

  const result = builder.filter(s => s?.length).join(splitter)
  return result
}

const addName = (object: IComponent): string => {
  return `name: '${object.name}',`;
}

const addImportComponents = (object: IComponent, from = 'path'): string => {
  const imports = object.components;
  return imports && imports.length
    ? `import {${imports.join(',')}} from '${from}'`
    : '';
}


const addImportVue = (object: IComponent): string => {
  let imports: string[] = ['reactive', ...getProperties(object, EPropertyType.Hook).map(_ => _.name)]

  const plugins = ['watch', 'computed']
  const keys = Object.keys(object)
  imports = [...imports, ...keys.filter((key) => plugins.indexOf(key) !== -1)]

  return `import {${imports.join(',')}} from 'vue'`
}

const addOpen = (): string => 'export default {'

const addComponents = (object: IComponent): string => {
  const components = object.components;
  return components?.length
    ? `components: {${components.join(',')}},`
    : ''
}

const addClose = (): string => '}'


const addProps = (object: IComponent): string => {
  const props = object.props;
  if (!props?.length) {
    return ''
  }
  const result = props.map((_) => `'${_}'`)
  return `props: [${result.join(',')}]`
}

const addSetup = (object: IComponent): string => {
  const builder = []
  const buildFunctions = [
    {
      func: addData,
      type: EPropertyType.Data,
    },
    {
      func: addComputed,
      type: EPropertyType.Computed,
    },
    {
      func: addWatch,
      type: EPropertyType.Watch,
    },
    {
      func: addMethods,
      type: EPropertyType.Method,
    },
    {
      func: addHooks,
      type: EPropertyType.Hook,
    },
  ];
  builder.push('setup(){')

  buildFunctions.forEach(f => {
    builder.push(f.func(getProperties(object, f.type)));
  });

  builder.push(addReturned(object));

  builder.push('}')

  const result = builder.filter(_ => _?.length).join(splitter)
  return result
}

const addReturned = (object: IComponent) => {
  return `return {${object.properties.map(p => p.name).join(','+ splitter)}}`;
}

const addData = (data: IComponentVariable[]): string => {
  const builder: string[] = []
  data.forEach((item) => {
    builder.push(`let ${item.name} = reactive(${toString(item.value)})`)
  })
  return builder.join(splitter)
}

const addComputed = (computed: IComponentVariable[]): string => {
  const builder: string[] = []
  computed.forEach((item) => {
    builder.push(`const ${item.name} = computed(${item.value})`)
  })
  return builder.join(splitter)
}

const addWatch = (watch: IComponentVariable[]): string => {
  if (!watch?.length) {
    return '';
  }
  const builder: string[] = []
  watch.forEach((item) => {
    builder.push(item.value)
  })
  return `watch(${builder.join(',')})`
}

const addMethods = (methods: IComponentVariable[]): string => {
  const builder: string[] = []
  methods.forEach((item) => {
    builder.push(`const ${item.name} = ${item.value}`)
  })
  return builder.join(splitter)
}

const addHooks = (hooks: IComponentVariable[]): string => {
  const builder: string[] = []
  hooks.forEach((hook) => {
    builder.push(`${hook.name}(${hook.value})`)
  })
  return builder.join(splitter)
}

const toString = (item: any): string => {
  if (Array.isArray(item)) {
    // array
    const builder: string[] = []
    item.forEach((_) => {
      builder.push(toString(_))
    })
    return `[${builder.join(',')}]`
  }

  if (typeof item === 'object' && item !== null) {
    // object
    const builder: string[] = []
    Object.keys(item).forEach((name) => {
      builder.push(`${name}: ${toString(item[name])}`)
    })
    return `{${builder.join(',')}}`
  }

  if (typeof item === 'string') {
    // string
    return `'${item}'`
  }

  return item // number, float, boolean
}
