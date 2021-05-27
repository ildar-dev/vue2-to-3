import { ConnectionsType, InstanceDeps, Noop } from '../types'

const splitter = /this.[0-9a-zA-Z]{0,}/
const splitterThis = 'this.'

export const findDepsByString = (
  vueExpression: string,
  instanceDeps: InstanceDeps
): ConnectionsType | undefined => {
  return vueExpression
    .match(splitter)
    ?.map((match) => match.split(splitterThis)[1])
    .filter((value) => instanceDeps[value])
    .map((value) => value)
}

export const findDeps = (
  vueExpression: Noop,
  instanceDeps: InstanceDeps
): ConnectionsType | undefined => {
  const target = {}
  const proxy = new Proxy(target, {
    get(target: any, name) {
      target[name] = 'get'
      return true
    },
    set(target: any, name) {
      target[name] = 'set'
      return true
    }
  })
  try {
    vueExpression.bind(proxy)() // avoid: it's execute function in proxy scope
    return Object.keys(target) || []
  } catch (e) {
    return findDepsByString(vueExpression.toString(), instanceDeps) || []
  }
}
