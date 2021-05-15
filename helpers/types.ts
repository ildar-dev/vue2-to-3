type BasicType = string | number | boolean | Object

export type IncomingPropsType = {
  [propName: string]: {
    type: BasicType
  } | BasicType
} | string

export type PropsType = ''

export type DataItemType = Record<string,any>

export type MethodsType = {}

type DefaultData<V> = object | ((this: V) => object)

type DefaultProps = Record<string, any>

type DefaultMethods<V> = { [key: string]: (this: V, ...args: any[]) => any }

type DefaultComputed = { [key: string]: any }

export interface ComputedOptions<T> {
  get?(): T

  set?(value: T): void

  cache?: boolean
}

export type Accessors<T> = {
  [K in keyof T]: (() => T[K]) | ComputedOptions<T[K]>
}

export type RecordPropsDefinition<T> = {
  [K in keyof T]: PropValidator<T[K]>
}

export type PropValidator<T> = PropOptions<T> | PropType<T>;

export interface PropOptions<T = any> {
  type?: PropType<T>
  required?: boolean
  default?: T | null | undefined | (() => T | null | undefined)

  validator?(value: T): boolean
}

export type Prop<T> =
  { (): T }
  | { new(...args: never[]): T & object }
  | { new(...args: string[]): Function }

export type PropType<T> = Prop<T> | Prop<T>[]

export type ArrayPropsDefinition<T> = (keyof T)[]

export type PropsDefinition<T> = ArrayPropsDefinition<T> | RecordPropsDefinition<T>
export type WatchHandler<T> = (val: T, oldVal: T) => void

export interface WatchOptions {
  deep?: boolean
  immediate?: boolean
}

export interface WatchOptionsWithHandler<T> extends WatchOptions {
  handler: WatchHandler<T>
}

export interface ComponentOptions<V extends {},
  Data = DefaultData<V>,
  Methods = DefaultMethods<V>,
  Computed = DefaultComputed,
  PropsDef = PropsDefinition<DefaultProps>,
// @ts-ignore
  Props = DefaultProps> {
  data?: Data
  props?: PropsDef
  computed?: Accessors<Computed>
  methods?: Methods
  watch?: Record<string, WatchOptionsWithHandler<any> | WatchHandler<any> | string>

  beforeCreate?(this: V): void

  created?(): void

  beforeDestroy?(): void

  destroyed?(): void

  beforeMount?(): void

  mounted?(): void

  beforeUpdate?(): void

  updated?(): void

  components?: any

  name?: string;
}

export type KeysType = keyof ComponentOptions<any>
