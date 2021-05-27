import { extractInstanceData } from './extractInstanceData'
import {
  findDeps,
  toVue3HookName,
  transformObjectToArray,
  transformObjectToArrayWithName
} from '../helpers'
import {
  ConnectionsType,
  EPropertyType,
  IComponent,
  ComponentOptions,
  KeysType,
  IComponentVariable,
  InitialIComponent,
  VueDataKeys,
  WatcherItem
} from '../types'

export function parser(input: ComponentOptions<any>): IComponent | never {
  const keys = Object.keys(input) as Array<KeysType>
  const initialParseResult = extractInstanceData(input)
  const vueConnectionKeysToValue = (Object.keys(initialParseResult.data) as [VueDataKeys]).reduce(
    (acc: Record<any, VueDataKeys>, key: VueDataKeys) => {
      initialParseResult.data[key].forEach((dataField: any) => {
        acc[dataField] = key
      })
      return acc
    },
    {}
  )
  const result: InitialIComponent = {}

  keys.forEach((i) => {
    const item = input[i]

    const addConnection = (cb: (...args: any[]) => void) => {
      let connections: ConnectionsType = []
      const deps = findDeps(cb, vueConnectionKeysToValue)
      if (deps) {
        connections = [...deps]
      }
      return connections
    }

    const addNewProperty = (propetries: IComponentVariable) => {
      result.properties = [
        ...(result.properties ?? []),
        {
          ...propetries
        }
      ]
    }

    switch (i) {
      case 'data': {
        const data = typeof item === 'object' ? item : item()
        transformObjectToArrayWithName(data).forEach((v) => {
          addNewProperty({
            type: EPropertyType.Data,
            ...v
          })
        })
        break
      }
      case 'props': {
        result[i] = item.slice ? item : transformObjectToArray(item)
        break
      }
      case 'inject': {
        (item.slice ? item : transformObjectToArray(item)).forEach((v: any) => {
          addNewProperty({ type: EPropertyType.Inject, name: v, id: v })
        })
        break
      }
      case 'watch': {
        const watchValues = Object.keys(item).map((key) => {
          const watchItem = item[key]
          let watchResult = {}
          addConnection(watchItem)
          if (watchItem === 'object') {
            watchItem['name'] = key
            watchResult = { ...watchItem, name: key }
          } else {
            watchResult = { handler: watchItem, name: key }
          }
          return watchResult as WatcherItem
        })
        watchValues.forEach((v) => {
          const connections = addConnection(v.handler)
          addNewProperty({
            type: EPropertyType.Watch,
            value: v.handler,
            name: v.name,
            id: v.name,
            connections
          })
        })
        break
      }
      case 'provide': {
        if (typeof item === 'function') {
          const connections = addConnection(item)
          Object.keys(item()).forEach((v) => {
            addNewProperty({
              type: EPropertyType.Provide,
              value: item[v],
              name: v,
              id: v,
              connections
            })
          })
        } else {
          Object.keys(item).forEach((v) => {
            const connections = addConnection(() => item[v])
            addNewProperty({
              type: EPropertyType.Provide,
              value: item[v],
              name: v,
              id: v,
              connections
            })
          })
        }
        break
      }
      case 'computed':
      case 'methods': {
        transformObjectToArrayWithName(item).forEach((v) => {
          const connections = addConnection(v.value)
          addNewProperty({
            type: i === 'computed' ? EPropertyType.Computed : EPropertyType.Method,
            ...v,
            connections
          })
        })
        break
      }
      case 'mounted':
      case 'beforeCreate':
      case 'beforeDestroy':
      case 'beforeMount':
      case 'beforeUpdate':
      case 'created':
      case 'updated':
      case 'destroyed': {
        const connections = addConnection(item)
        const name = toVue3HookName(i)
        addNewProperty({
          type: EPropertyType.Hook,
          name,
          value: item,
          id: name,
          connections
        })
        break
      }
      case 'components': {
        result[i] = transformObjectToArray(item)
        break
      }
      case 'name': {
        result[i] = item
        break
      }
    }
  })
  if (result) {
    return result as IComponent
  } else {
    throw new Error('Some problem with parse file')
  }
}
