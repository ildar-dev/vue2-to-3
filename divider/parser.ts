import { exampleInputData } from '../helpers'
import { initialParse } from './initialParser'
import { findDeps } from '../helpers/findDeps'
import { transformObjectToArray, transformObjectToArrayWithName } from '../helpers/utils'
import { toVue3HookName } from '../helpers/utils/vue2'
import {
  ComponentOptions,
  ConnectionsType,
  EPropertyType,
  IComponent,
  IComponentVariable,
  InitialIComponent,
  KeysType,
  VueDataKeys
} from '../helpers/types'

import { divide } from '../helpers/compositionDivide';

function parser(input: ComponentOptions<any>): IComponent | undefined {
  const keys = Object.keys(input) as Array<KeysType>
  const initialParseResult = initialParse(input)
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

    const addConnection = (cb: () => void) => {
      const bodyText = cb.toString()
      let connections: ConnectionsType = []
      const deps = findDeps(bodyText, vueConnectionKeysToValue)
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
          return watchResult as { handler: any, name: string }
        })
        watchValues.forEach((v) => {
          const connections = addConnection((v as { handler: () => void }).handler)
          addNewProperty({
            type: EPropertyType.Watch,
            value: v.handler,
            name: v.name,
            id:v.name,
            connections
          })
        })

        break
      }
      case 'provide': {
        if (typeof item === 'function') {
          const connections = addConnection(item)
          Object.keys(item()).forEach(v => {
            addNewProperty({
              type: EPropertyType.Provide,
              value: item[v],
              name: v,
              id: v,
              connections
            })
          })
        } else {
          Object.keys(item).forEach(v => {
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
          const connections = addConnection(Object.values(v)[0] as () => void)
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
        const connections = addConnection(item as () => void)
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
  return result ? (result as IComponent) : undefined
}

const parsedObject = parser(exampleInputData)

// console.log(parsedObject?.properties.find(_ => _.id === "array"));
console.log(divide(parsedObject!));

