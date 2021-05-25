import { ConnectionsType, VueDataKeys } from './types'

const splitter = /this.[0-9a-zA-Z]{0,}/
const splitterThis = 'this.'

export const findDepsByString = (
  vueExpression: string,
  instanceDeps: Record<any, VueDataKeys>
): ConnectionsType | undefined => {
  return vueExpression
    .match(splitter)
    ?.map((match) => match.split(splitterThis)[1])
    .filter(value => instanceDeps[value])
    .map((value: any) =>  value)
}

export const findDeps = (vueExpression: Function, instanceDeps: Record<any, VueDataKeys>): ConnectionsType | undefined => {
  const target = {};
  const proxy = new Proxy(target, {
    get(target: any, name) {
      target[name] = 'get';
      return true;
    },
    set(target: any, name) {
      target[name] = 'set';
      return true;
    },
  });
  try {
    vueExpression.bind(proxy)() // avoid: it's execute function in proxy scope
    return Object.keys(target) || [];
  } catch(e) {
    return findDepsByString(vueExpression.toString(), instanceDeps) || [];
  }
}
