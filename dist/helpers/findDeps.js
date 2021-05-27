const splitter = /this.[0-9a-zA-Z]{0,}/;
const splitterThis = 'this.';
export const findDepsByString = (vueExpression, instanceDeps) => {
    var _a;
    return (_a = vueExpression
        .match(splitter)) === null || _a === void 0 ? void 0 : _a.map((match) => match.split(splitterThis)[1]).filter((value) => instanceDeps[value]).map((value) => value);
};
export const findDeps = (vueExpression, instanceDeps) => {
    const target = {};
    const proxy = new Proxy(target, {
        get(target, name) {
            target[name] = 'get';
            return true;
        },
        set(target, name) {
            target[name] = 'set';
            return true;
        }
    });
    try {
        vueExpression.bind(proxy)();
        return Object.keys(target) || [];
    }
    catch (e) {
        return findDepsByString(vueExpression.toString(), instanceDeps) || [];
    }
};
//# sourceMappingURL=findDeps.js.map