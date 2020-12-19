"use strict";
exports.__esModule = true;
exports.toVue3HookName = exports.vue2HooksDeprecated = exports.vue2Hooks = exports.vue2Imports = void 0;
exports.vue2Imports = ['watch', 'computed'];
exports.vue2Hooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdated',
    'updated',
    'beforeDestroy',
    'destroyed',
];
exports.vue2HooksDeprecated = ['beforeCreate', 'created'];
function toVue3HookName(name) {
    return 'on' + name[0].toUpperCase() + name.substr(1);
}
exports.toVue3HookName = toVue3HookName;
