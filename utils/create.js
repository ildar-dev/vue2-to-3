"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.create = void 0;
var vue2_1 = require("./utils/vue2");
var splitter = '\n';
var hooks = [
    'mounted',
    'beforeCreate',
    'beforeDestroy',
    'beforeMount',
    'beforeUpdate',
    'created',
    'updated',
    'destroyed'
].map(function (_) { return vue2_1.toVue3HookName(_); });
var create = function (object) {
    console.log(object);
    var builder = [];
    builder.push(addImportComponents(object.components));
    builder.push(addImportVue(object));
    builder.push(addOpen());
    builder.push(addComponents(object.components));
    builder.push(addProps(object.props));
    builder.push(addSetup(object));
    builder.push(addClose());
    var result = builder.join(splitter);
    return result;
};
exports.create = create;
var addImportComponents = function (imports, from) {
    if (from === void 0) { from = 'path'; }
    return "import {" + imports.join(',') + "} from '" + from + "'";
};
var addImportVue = function (object) {
    var imports = __spreadArrays(['reactive'], getUsedHooks(object));
    var plugins = ['watch', 'computed'];
    var keys = Object.keys(object);
    imports = __spreadArrays(imports, keys.filter(function (key) { return plugins.indexOf(key) !== -1; }));
    return "import {" + imports.join(',') + "} from 'vue'";
};
var addOpen = function () { return 'export default {'; };
var addComponents = function (components) { return "components: {" + components.join(',') + "}"; };
var addClose = function () { return '}'; };
var addProps = function (props) {
    var result = props.map(function (_) { return "'" + _ + "'"; });
    return "props: [" + result.join(',') + "]";
};
var addSetup = function (object) {
    var builder = [];
    builder.push('setup(){');
    builder.push(addData(object.data));
    builder.push(addComputed(object.computed));
    builder.push(addWatch(object.watch));
    builder.push(addMethods(object.methods));
    builder.push(addHooks(object));
    builder.push('}');
    var result = builder.join(splitter);
    return result;
};
var addData = function (data) {
    var builder = [];
    data.forEach(function (item) {
        var name = Object.keys(item)[0];
        builder.push("let " + name + " = reactive(" + toString(item[name]) + ")");
    });
    return builder.join(splitter);
};
var addComputed = function (computed) {
    var builder = [];
    computed.forEach(function (item) {
        var name = Object.keys(item)[0];
        builder.push("const " + name + " = computed(" + item[name] + ")");
    });
    return builder.join(splitter);
};
var addWatch = function (watch) {
    var builder = [];
    watch.forEach(function (item) {
        builder.push(item.handler);
    });
    return "watch(" + builder.join(',') + ")";
};
var addMethods = function (methods) {
    var builder = [];
    methods.forEach(function (item) {
        var name = Object.keys(item)[0];
        builder.push("const " + name + " = " + item[name]);
    });
    return builder.join(splitter);
};
var addHooks = function (object) {
    var builder = [];
    getUsedHooks(object).forEach(function (hook) {
        builder.push(hook + "(" + object[hook] + ")");
    });
    return builder.join(splitter);
};
var getUsedHooks = function (object) {
    return Object.keys(object).filter(function (key) { return hooks.indexOf(key) !== -1; }); // use includes since ts 2.1
};
var toString = function (item) {
    if (Array.isArray(item)) { // array
        var builder_1 = [];
        item.forEach(function (_) {
            builder_1.push(toString(_));
        });
        return "[" + builder_1.join(',') + "]";
    }
    if (typeof item === 'object' && item !== null) { // object
        var builder_2 = [];
        Object.keys(item).forEach(function (name) {
            builder_2.push(name + ": " + toString(item[name]));
        });
        return "{" + builder_2.join(',') + "}";
    }
    if (typeof item === 'string') { // string
        return "'" + item + "'";
    }
    return item; // number, float, boolean
};
