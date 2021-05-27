import { extractInstanceData } from './extractInstanceData';
import { findDeps, toVue3HookName, transformObjectToArray, transformObjectToArrayWithName } from '../helpers';
import { EPropertyType } from '../types';
export function parser(input) {
    const keys = Object.keys(input);
    const initialParseResult = extractInstanceData(input);
    const vueConnectionKeysToValue = Object.keys(initialParseResult.data).reduce((acc, key) => {
        initialParseResult.data[key].forEach((dataField) => {
            acc[dataField] = key;
        });
        return acc;
    }, {});
    const result = {};
    keys.forEach((i) => {
        const item = input[i];
        const addConnection = (cb) => {
            let connections = [];
            const deps = findDeps(cb, vueConnectionKeysToValue);
            if (deps) {
                connections = [...deps];
            }
            return connections;
        };
        const addNewProperty = (propetries) => {
            var _a;
            result.properties = [
                ...((_a = result.properties) !== null && _a !== void 0 ? _a : []),
                Object.assign({}, propetries)
            ];
        };
        switch (i) {
            case 'data': {
                const data = typeof item === 'object' ? item : item();
                transformObjectToArrayWithName(data).forEach((v) => {
                    addNewProperty(Object.assign({ type: EPropertyType.Data }, v));
                });
                break;
            }
            case 'props': {
                result[i] = item.slice ? item : transformObjectToArray(item);
                break;
            }
            case 'inject': {
                (item.slice ? item : transformObjectToArray(item)).forEach((v) => {
                    addNewProperty({ type: EPropertyType.Inject, name: v, id: v });
                });
                break;
            }
            case 'watch': {
                const watchValues = Object.keys(item).map((key) => {
                    const watchItem = item[key];
                    let watchResult = {};
                    addConnection(watchItem);
                    if (watchItem === 'object') {
                        watchItem['name'] = key;
                        watchResult = Object.assign(Object.assign({}, watchItem), { name: key });
                    }
                    else {
                        watchResult = { handler: watchItem, name: key };
                    }
                    return watchResult;
                });
                watchValues.forEach((v) => {
                    const connections = addConnection(v.handler);
                    addNewProperty({
                        type: EPropertyType.Watch,
                        value: v.handler,
                        name: v.name,
                        id: v.name,
                        connections
                    });
                });
                break;
            }
            case 'provide': {
                if (typeof item === 'function') {
                    const connections = addConnection(item);
                    Object.keys(item()).forEach((v) => {
                        addNewProperty({
                            type: EPropertyType.Provide,
                            value: item[v],
                            name: v,
                            id: v,
                            connections
                        });
                    });
                }
                else {
                    Object.keys(item).forEach((v) => {
                        const connections = addConnection(() => item[v]);
                        addNewProperty({
                            type: EPropertyType.Provide,
                            value: item[v],
                            name: v,
                            id: v,
                            connections
                        });
                    });
                }
                break;
            }
            case 'computed':
            case 'methods': {
                transformObjectToArrayWithName(item).forEach((v) => {
                    const connections = addConnection(v.value);
                    addNewProperty(Object.assign(Object.assign({ type: i === 'computed' ? EPropertyType.Computed : EPropertyType.Method }, v), { connections }));
                });
                break;
            }
            case 'mounted':
            case 'beforeCreate':
            case 'beforeDestroy':
            case 'beforeMount':
            case 'beforeUpdate':
            case 'created':
            case 'updated':
            case 'destroyed': {
                const connections = addConnection(item);
                const name = toVue3HookName(i);
                addNewProperty({
                    type: EPropertyType.Hook,
                    name,
                    value: item,
                    id: name,
                    connections
                });
                break;
            }
            case 'components': {
                result[i] = transformObjectToArray(item);
                break;
            }
            case 'name': {
                result[i] = item;
                break;
            }
        }
    });
    if (result) {
        return result;
    }
    else {
        throw new Error('Some problem with parse file');
    }
}
//# sourceMappingURL=parser.js.map