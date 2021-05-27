import Vue from 'vue'

import { ComponentOptions, VueDataKeys } from '../types'
import { vue2ConnectionsValues } from '../helpers'

export type VueConnections = Partial<Record<VueDataKeys, any>>

type ParserResult = {
  data: VueConnections
  instanceOptions?: ComponentOptions<Vue>
}

export const initialParserResult: ParserResult = { data: {} }

export const extractInstanceData = (input: ComponentOptions<any>) => {
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
