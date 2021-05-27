import Vue from 'vue';
import { vue2ConnectionsValues } from '../helpers';
export const initialParserResult = { data: {} };
export const extractInstanceData = (input) => {
    const instance = new Vue(Object.assign(Object.assign({}, input), { template: '' }));
    vue2ConnectionsValues.forEach((value) => {
        const vueDataKey = instance.$options[value];
        initialParserResult.data[value] =
            typeof vueDataKey !== undefined
                ? typeof vueDataKey === 'function'
                    ? Object.keys(vueDataKey.bind(instance)())
                    : Object.keys(vueDataKey || {})
                : null;
    });
    initialParserResult.instanceOptions = instance.$options;
    return initialParserResult;
};
//# sourceMappingURL=extractInstanceData.js.map