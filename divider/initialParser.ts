import Vue from 'vue'

import { ComponentOptions, VueDataKeys } from '../helpers/types'
// import { exampleInputData } from '../helpers'
import { vue2ConnectionsValues } from '../helpers/utils/vue2'


type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type Nullable<T> = {
  [K in keyof T]?: T | null
}

export type VueConnections = Partial<Record<VueDataKeys, any>>

type ParserResult = {
  data: VueConnections
  instanceOptions?: ComponentOptions<Vue>
}

export const initialParserResult: ParserResult = { data: {} }

export const initialParse = (input: ComponentOptions<any>) => {
  const instance = new Vue({ ...input, template: '' }) as Vue
  vue2ConnectionsValues.forEach((value) => {
    const vueDataKey = instance.$options[value]
    initialParserResult.data[value] =
      typeof vueDataKey !== undefined
        ? typeof vueDataKey === 'function'
          ? Object.keys(vueDataKey.bind(instance)())
          : Object.keys(vueDataKey || {})
        : null
  })

  initialParserResult.instanceOptions = instance.$options

  return initialParserResult
}

// initialParse(exampleInputData)
