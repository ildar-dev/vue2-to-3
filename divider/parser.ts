import { exampleInputData } from '../helpers'
import { initialParse } from './initialParser'
import { findDeps } from '../helpers/findDeps'
import { transformObjectToArray, transformObjectToArrayWithName } from '../helpers/utils'
import { toVue3HookName } from '../helpers/utils/vue2'
import {
  ComponentOptions,
  ConnectionType,
  EPropertyType,
  IComponent,
  IComponentVariable,
  InitialIComponent,
  KeysType,
  VueDataKeys
} from '../helpers/types'

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
      let connections: ConnectionType = []
      const deps = findDeps(bodyText, vueConnectionKeysToValue)
      if (deps) {
        connections = [...deps]
      }
      return connections
    }

    const addNewProperty = ({ type, connections, value }: IComponentVariable) => {
      result.properties = [
        ...(result.properties ?? []),
        {
          type,
          value,
          connections
        }
      ]
    }

    switch (i) {
      case 'data': {
        const data = typeof item === 'object' ? item : item()
        transformObjectToArrayWithName(data).forEach((v) => {
          addNewProperty({
            type: EPropertyType.Data,
            value: v
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
          addNewProperty({ type: EPropertyType.Inject, value: v })
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
          return watchResult
        })
        watchValues.forEach((v) => {
          const connections = addConnection((v as { handler: () => void }).handler)
          addNewProperty({
            type: EPropertyType.Watch,
            value: v,
            connections
          })
        })

        break
      }
      case 'provide': {
        if (typeof item === 'function') {
          const connections = addConnection(item)
          addNewProperty({
            type: EPropertyType.Provide,
            value: item,
            connections
          })
        } else {
          Object.keys(item).forEach(v => {
            const connections = addConnection(() => item[v])
            addNewProperty({
              type: EPropertyType.Provide,
              value: item[v],
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
            value: v,
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
        addNewProperty({
          type: EPropertyType.Hook,
          value: {
            hookName: toVue3HookName(i),
            body: transformObjectToArrayWithName(item)
          },
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

console.log(parsedObject)
