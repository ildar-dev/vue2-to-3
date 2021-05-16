import { toVue3HookName } from './utils/vue2'

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

export const create = (object: any): string => {
  console.log(object)
  const builder = []

  builder.push(addImportComponents(object.components))
  builder.push(addImportVue(object))
  builder.push(addOpen())
  builder.push(addComponents(object.components))
  builder.push(addProps(object.props))
  builder.push(addSetup(object))
  builder.push(addClose())

  const result = builder.join(splitter)
  return result
}

const addImportComponents = (imports: string[], from = 'path'): string =>
  `import {${imports.join(',')}} from '${from}'`

const addImportVue = (object): string => {
  let imports: string[] = ['reactive', ...getUsedHooks(object)]

  const plugins = ['watch', 'computed']
  const keys = Object.keys(object)
  imports = [...imports, ...keys.filter((key) => plugins.indexOf(key) !== -1)]

  return `import {${imports.join(',')}} from 'vue'`
}

const addOpen = (): string => 'export default {'

const addComponents = (components: string[]): string => `components: {${components.join(',')}}`

const addClose = (): string => '}'

const addProps = (props: string[]): string => {
  const result = props.map((_) => `'${_}'`)
  return `props: [${result.join(',')}]`
}

const addSetup = (object): string => {
  const builder = []
  builder.push('setup(){')

  builder.push(addData(object.data))
  builder.push(addComputed(object.computed))
  builder.push(addWatch(object.watch))
  builder.push(addMethods(object.methods))
  builder.push(addHooks(object))
  builder.push('}')

  const result = builder.join(splitter)
  return result
}

const addData = (data): string => {
  const builder = []
  data.forEach((item) => {
    const name = Object.keys(item)[0]
    builder.push(`let ${name} = reactive(${toString(item[name])})`)
  })
  return builder.join(splitter)
}

const addComputed = (computed): string => {
  const builder = []
  computed.forEach((item) => {
    const name = Object.keys(item)[0]
    builder.push(`const ${name} = computed(${item[name]})`)
  })
  return builder.join(splitter)
}

const addWatch = (watch: { handler; name }[]): string => {
  const builder = []
  watch.forEach((item) => {
    builder.push(item.handler)
  })
  return `watch(${builder.join(',')})`
}

const addMethods = (methods: {}[]): string => {
  const builder = []
  methods.forEach((item) => {
    const name = Object.keys(item)[0]
    builder.push(`const ${name} = ${item[name]}`)
  })
  return builder.join(splitter)
}

const addHooks = (object): string => {
  const builder = []
  getUsedHooks(object).forEach((hook) => {
    builder.push(`${hook}(${object[hook]})`)
  })
  return builder.join(splitter)
}

const getUsedHooks = (object): string[] => {
  return Object.keys(object).filter((key) => hooks.indexOf(key) !== -1) // use includes since ts 2.1
}

const toString = (item): string => {
  if (Array.isArray(item)) {
    // array
    const builder = []
    item.forEach((_) => {
      builder.push(toString(_))
    })
    return `[${builder.join(',')}]`
  }

  if (typeof item === 'object' && item !== null) {
    // object
    const builder = []
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
