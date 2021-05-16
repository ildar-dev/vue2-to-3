import { exampleInputData } from '../helpers'
import { initialParse } from './initialParser'
import { findDeps } from '../helpers/findDeps'
import { transformObjectToArray, transformObjectToArrayWithName } from '../helpers/utils'
import { toVue3HookName } from '../helpers/utils/vue2'
import {
  ComponentOptions,
  ConnectionType,
  EPropertyType,
  IComponent, IComponentVariable,
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
    let connections: ConnectionType = []

    const addConnection = (cb: () => void) => {
      const bodyText = cb.toString()
      const deps = findDeps(bodyText, vueConnectionKeysToValue)
      if (deps) {
        connections = [...connections, ...deps]
      }
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
        addNewProperty({
          type: EPropertyType.Data,
          value: transformObjectToArrayWithName(data)
        })
        break
      }
      case 'props': {
        result[i] = item.slice ? item : transformObjectToArray(item)
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
        addNewProperty({
          type: EPropertyType.Watch,
          value: watchValues,
          connections
        })
        break
      }
      case 'computed':
      case 'methods': {
        Object.values(item).forEach((field) => {
          addConnection(field as () => void)
        })
        addNewProperty({
          type: i === 'computed' ? EPropertyType.Computed : EPropertyType.Method,
          value: transformObjectToArrayWithName(item),
          connections
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
