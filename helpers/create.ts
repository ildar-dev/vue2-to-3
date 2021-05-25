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
  console.log(object)
  const builder = []

  builder.push(addImportComponents(object.components))
  builder.push(addImportVue(object))
  builder.push(addOpen())
  builder.push(addName(object.name))
  builder.push(addComponents(object.components))
  builder.push(addProps(object.props))
  builder.push(addSetup(object))
  builder.push(addClose())

  const result = builder.join(splitter)
  return result
}

const addName = (name: string): string => {
  return `name: '${name}',`;
}

const addImportComponents = (imports?: string[], from = 'path'): string =>
  imports && imports.length
    ? `import {${imports.join(',')}} from '${from}'`
    : '';


const addImportVue = (object: IComponent): string => {
  let imports: string[] = ['reactive', ...getProperties(object, EPropertyType.Hook).map(_ => _.name)]

  const plugins = ['watch', 'computed']
  const keys = Object.keys(object)
  imports = [...imports, ...keys.filter((key) => plugins.indexOf(key) !== -1)]

  return `import {${imports.join(',')}} from 'vue'`
}

const addOpen = (): string => 'export default {'

const addComponents = (components?: string[]): string => 
  components
    ? `components: {${components.join(',')}}`
    : ''

const addClose = (): string => '}'


const addProps = (props?: string[]): string => {
  if (!props) {
    return ''
  }
  const result = props.map((_) => `'${_}'`)
  return `props: [${result.join(',')}]`
}

const addSetup = (object: IComponent): string => {
  const builder = []
  builder.push('setup(){')

  builder.push(addData(getProperties(object, EPropertyType.Data)))
  builder.push(addComputed(getProperties(object, EPropertyType.Computed)))
  builder.push(addWatch(getProperties(object, EPropertyType.Watch)))
  builder.push(addMethods(getProperties(object, EPropertyType.Method)))
  builder.push(addHooks(getProperties(object, EPropertyType.Hook)))
  builder.push('}')

  const result = builder.join(splitter)
  return result
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

// const getUsedHooks = (object): string[] => {
//   return Object.keys(object).filter((key) => hooks.indexOf(key) !== -1) // use includes since ts 2.1
// }

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
