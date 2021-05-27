import { WatchOptionsWithHandler } from './core'
import { vue2ConnectionsValues } from '../helpers/vue2'

export type FieldName = {
  name: string
}

export type WatcherItem<T = any> = Pick<WatchOptionsWithHandler<T>, 'handler'> & FieldName

export enum EPropertyType {
  Method = 'Method',
  Data = 'Data',
  Hook = 'Hook',
  Computed = 'Computed',
  Provide = 'Provide',
  Inject = 'Inject',
  Watch = 'Watch'
}

export type TId = string

export type ConnectionsType = Array<TId>

export type VueDataKeys = typeof vue2ConnectionsValues[number]

export interface IComponentVariable {
  value?: any
  id: TId
  name: string
  type: EPropertyType
  connections?: ConnectionsType
}

export interface IComponent {
  components?: string[]
  name: string
  props?: string[]
  properties: IComponentVariable[]
}

export type InitialIComponent = Partial<IComponent>
