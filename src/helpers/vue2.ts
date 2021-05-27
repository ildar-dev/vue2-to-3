export const vue2ConnectionsValues = ['inject', 'computed', 'data', 'props'] as const

export const vue2Hooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdated',
  'updated',
  'beforeDestroy',
  'destroyed'
] as const

export function toVue3HookName(name: string): string {
  return 'on' + name[0].toUpperCase() + name.substr(1)
}
