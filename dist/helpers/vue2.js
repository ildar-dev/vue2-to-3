export const vue2ConnectionsValues = ['inject', 'computed', 'data', 'props'];
export const vue2Hooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdated',
    'updated',
    'beforeDestroy',
    'destroyed'
];
export function toVue3HookName(name) {
    return 'on' + name[0].toUpperCase() + name.substr(1);
}
//# sourceMappingURL=vue2.js.map