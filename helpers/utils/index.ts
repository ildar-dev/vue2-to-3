export const transformObjectToArrayWithName = (object: Record<string, unknown>): Array<{ name: string, value: any, id: string }> => {
  const dataKeys = Object.keys(object)
  return dataKeys.map((value) => ({
    name: value,
    id: value,
    value: object[value]
  }))
}

export const transformObjectToArray = (object: Object): Array<any> => {
  return Object.keys(object).map((value) => value)
}
