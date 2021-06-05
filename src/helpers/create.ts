import { EPropertyType, IComponent, IComponentVariable } from '../types'
import { toVue3HookName, vue2Hooks } from './vue2'

const splitter = '\n'

vue2Hooks.map((hookName) => toVue3HookName(hookName))

const getProperties = (object: IComponent, type: EPropertyType): IComponentVariable[] => {
  return object.properties.filter((property) => property.type === type)
}

export const stringify = (object: IComponent): string => {
  const builder: string[] = []

  const buildFunctionsComponent = [
    addImportComponents,
    addImportCompositions,
    addImportVue,
    addOpen,
    addName,
    addComponents,
    addProps,
    addSetup,
    addClose
  ]

  const buildFunctionsComposition = [
    addImportVue,
    addSetup,
  ]

  if (object.isComponent) {
    buildFunctionsComponent.forEach((f) => {
      builder.push(f(object))
    })
  } else {
    buildFunctionsComposition.forEach((f) => {
      builder.push(f(object))
    })
  }

  return builder.filter((s) => s?.length).join(splitter)
}

const addName = (object: IComponent): string => {
  return `name: '${object.name}',`
}

const addImportComponents = (object: IComponent, from = 'path'): string => {
  const imports = object.components
  return imports && imports.length ? `import {${imports.join(',')}} from '${from}'` : ''
}

const addImportCompositions = (object: IComponent): string => {
  const compositions = object.compositions;
  if (!compositions?.length) {
    return '';
  }
  return compositions.map((c: IComponent) => `import { ${c.name} } from './${c.name}.js'`).join(splitter);
}

const addImportVue = (object: IComponent): string => {
  let imports: string[] = [
    'reactive',
    ...getProperties(object, EPropertyType.Hook).map((property) => property.name)
  ]

  const plugins = ['watch', 'computed']
  const keys = Object.keys(object)
  imports = [...imports, ...keys.filter((key) => plugins.indexOf(key) !== -1)]

  return `import {${imports.join(',')}} from 'vue'`
}

const addOpen = (): string => 'export default {'

const addComponents = (object: IComponent): string => {
  const components = object.components
  return components?.length ? `components: {${components.join(',')}},` : ''
}

const addClose = (): string => '}'

const addProps = (object: IComponent): string => {
  const props = object.props
  if (!props?.length) {
    return ''
  }
  const result = props.map((_) => `'${_}'`)
  return `props: [${result.join(',')}]`
}

const addSetup = (object: IComponent): string => {
  const builder:string[] = []
  const buildFunctions = [
    {
      func: addData,
      type: EPropertyType.Data
    },
    {
      func: addComputed,
      type: EPropertyType.Computed
    },
    {
      func: addWatch,
      type: EPropertyType.Watch
    },
    {
      func: addMethods,
      type: EPropertyType.Method
    },
    {
      func: addHooks,
      type: EPropertyType.Hook
    }
  ]
  if (object.isComponent) {
    builder.push('setup(props){')
  } else {
    builder.push(`export const ${object.name} = () => {`)
  }

  builder.push(addCompositions(object));

  buildFunctions.forEach((f) => {
    builder.push(f.func(getProperties(object, f.type)))
  })

  builder.push(addReturned(object))

  builder.push('}')

  return builder.filter((str) => str?.length).join(splitter)
}

const addCompositions = (object: IComponent): string => {
  if (!object.isComponent || !object?.compositions?.length) {
    return '';
  }

  const builder: string[] = [];
  const compositions = object.compositions;

  compositions.forEach((c: IComponent) => {
    builder.push(`const ${ c.name } = ${c.name}()`);
  })

  return builder.join(splitter);
}

const addReturned = (object: IComponent): string => {
  let properties: string[] = object.properties.map((p) => p.name);
  if (object.isComponent) {
    object.compositions?.forEach((c: IComponent) => {
      properties = [...properties, ...c.properties.map((p) => p.name)]
    })
  }
  return `return {${properties.join(',' + splitter)}}`
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
    return ''
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
