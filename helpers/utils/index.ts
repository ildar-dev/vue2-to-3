export const transformObjectToArrayWithName = (object: Record<string, unknown>): Array<any> => {
  const dataKeys = Object.keys(object)
  return dataKeys.map((value) => ({
    [value]: object[value]
  }))
}

export const transformObjectToArray = (object: Object): Array<any> => {
  return Object.keys(object).map((value) => value)
}
