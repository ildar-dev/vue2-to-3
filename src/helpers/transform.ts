import { IComponentVariable } from '../types'

export const transformObjectToArrayWithName = (
  object: Record<string, unknown>
): Array<Omit<IComponentVariable, 'connections' | 'type'>> => {
  const dataKeys = Object.keys(object)
  return dataKeys.map((value) => ({
    name: value,
    id: value,
    value: object[value]
  }))
}

export const transformObjectToArray = (object: Record<string, unknown>): Array<any> => {
  return Object.keys(object).map((value) => value)
}
