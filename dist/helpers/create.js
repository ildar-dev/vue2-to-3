import { EPropertyType } from '../types';
import { toVue3HookName, vue2Hooks } from './vue2';
const splitter = '\n';
vue2Hooks.map((hookName) => toVue3HookName(hookName));
const getProperties = (object, type) => {
    return object.properties.filter((property) => property.type === type);
};
export const stringify = (object) => {
    const builder = [];
    const buildFunctions = [
        addImportComponents,
        addImportVue,
        addOpen,
        addName,
        addComponents,
        addProps,
        addSetup,
        addClose
    ];
    buildFunctions.forEach((f) => {
        builder.push(f(object));
    });
    return builder.filter((s) => s === null || s === void 0 ? void 0 : s.length).join(splitter);
};
const addName = (object) => {
    return `name: '${object.name}',`;
};
const addImportComponents = (object, from = 'path') => {
    const imports = object.components;
    return imports && imports.length ? `import {${imports.join(',')}} from '${from}'` : '';
};
const addImportVue = (object) => {
    let imports = [
        'reactive',
        ...getProperties(object, EPropertyType.Hook).map((property) => property.name)
    ];
    const plugins = ['watch', 'computed'];
    const keys = Object.keys(object);
    imports = [...imports, ...keys.filter((key) => plugins.indexOf(key) !== -1)];
    return `import {${imports.join(',')}} from 'vue'`;
};
const addOpen = () => 'export default {';
const addComponents = (object) => {
    const components = object.components;
    return (components === null || components === void 0 ? void 0 : components.length) ? `components: {${components.join(',')}},` : '';
};
const addClose = () => '}';
const addProps = (object) => {
    const props = object.props;
    if (!(props === null || props === void 0 ? void 0 : props.length)) {
        return '';
    }
    const result = props.map((_) => `'${_}'`);
    return `props: [${result.join(',')}]`;
};
const addSetup = (object) => {
    const builder = [];
    const buildFunctions = [
        {
            func: addData,
            type: EPropertyType.Data
        },
        {
            func: addComputed,
            type: EPropertyType.Computed
        },
        {
            func: addWatch,
            type: EPropertyType.Watch
        },
        {
            func: addMethods,
            type: EPropertyType.Method
        },
        {
            func: addHooks,
            type: EPropertyType.Hook
        }
    ];
    builder.push('setup(){');
    buildFunctions.forEach((f) => {
        builder.push(f.func(getProperties(object, f.type)));
    });
    builder.push(addReturned(object));
    builder.push('}');
    return builder.filter((str) => str === null || str === void 0 ? void 0 : str.length).join(splitter);
};
const addReturned = (object) => {
    return `return {${object.properties.map((p) => p.name).join(',' + splitter)}}`;
};
const addData = (data) => {
    const builder = [];
    data.forEach((item) => {
        builder.push(`let ${item.name} = reactive(${toString(item.value)})`);
    });
    return builder.join(splitter);
};
const addComputed = (computed) => {
    const builder = [];
    computed.forEach((item) => {
        builder.push(`const ${item.name} = computed(${item.value})`);
    });
    return builder.join(splitter);
};
const addWatch = (watch) => {
    if (!(watch === null || watch === void 0 ? void 0 : watch.length)) {
        return '';
    }
    const builder = [];
    watch.forEach((item) => {
        builder.push(item.value);
    });
    return `watch(${builder.join(',')})`;
};
const addMethods = (methods) => {
    const builder = [];
    methods.forEach((item) => {
        builder.push(`const ${item.name} = ${item.value}`);
    });
    return builder.join(splitter);
};
const addHooks = (hooks) => {
    const builder = [];
    hooks.forEach((hook) => {
        builder.push(`${hook.name}(${hook.value})`);
    });
    return builder.join(splitter);
};
const toString = (item) => {
    if (Array.isArray(item)) {
        const builder = [];
        item.forEach((_) => {
            builder.push(toString(_));
        });
        return `[${builder.join(',')}]`;
    }
    if (typeof item === 'object' && item !== null) {
        const builder = [];
        Object.keys(item).forEach((name) => {
            builder.push(`${name}: ${toString(item[name])}`);
        });
        return `{${builder.join(',')}}`;
    }
    if (typeof item === 'string') {
        return `'${item}'`;
    }
    return item;
};
//# sourceMappingURL=create.js.map