import { ConnectionsType, VueDataKeys } from './types'

const splitter = /this.[0-9a-zA-Z]{0,}/
const splitterThis = 'this.'

export const findDeps = (
  vueExpression: string,
  instanceDeps: Record<any, VueDataKeys>
): ConnectionsType | undefined => {
  return vueExpression
    .match(splitter)
    ?.map((match) => match.split(splitterThis)[1])
    .filter(value => instanceDeps[value])
    .map((value: any) =>  value)
}
