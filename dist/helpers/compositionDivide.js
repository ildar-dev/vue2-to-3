export const getComponents = (componentVue) => {
    const n = componentVue.properties.length;
    const g = [];
    const gr = [];
    for (let i = 0; i < n; i++) {
        g[i] = [];
        gr[i] = [];
    }
    const order = [];
    let component = [];
    const components = [];
    componentVue.properties.forEach((v, a) => {
        var _a;
        const a1 = +a;
        (_a = v.connections) === null || _a === void 0 ? void 0 : _a.forEach(function (c) {
            const b = componentVue.properties.findIndex((property) => property.id === c);
            if (b == -1) {
                return;
            }
            g[a1].push(b);
            gr[b].push(a1);
        });
    });
    const used = new Array(n);
    for (let i = 0; i < n; ++i) {
        used[i] = false;
    }
    const dfs1 = function (v) {
        used[v] = true;
        for (let i = 0; i < g[v].length; ++i) {
            if (!used[g[v][i]]) {
                dfs1(g[v][i]);
            }
        }
        order.push(v);
    };
    const dfs2 = function (v) {
        used[v] = true;
        component.push(v);
        for (let i = 0; i < gr[v].length; ++i) {
            if (!used[gr[v][i]]) {
                dfs2(gr[v][i]);
            }
        }
    };
    for (let i = 0; i < n; ++i) {
        if (!used[i]) {
            dfs1(i);
        }
    }
    for (let i = 0; i < n; ++i) {
        used[i] = false;
    }
    for (let i = 0; i < n; ++i) {
        const v = order[i];
        if (!used[v]) {
            dfs2(v);
            components.push(component);
            component = [];
        }
    }
    return components;
};
export const divide = (componentVue, groupSingle = true) => {
    let components = getComponents(componentVue);
    if (groupSingle) {
        const singles = [];
        components.forEach((c) => {
            if (c.length === 1) {
                singles.push(c[0]);
            }
        });
        components = components.filter((c) => c.length > 1);
        components.push(singles);
    }
    const componentsVue = components
        .sort((c) => c.length)
        .map((c) => {
        return Object.assign(Object.assign({}, componentVue), { properties: componentVue.properties.filter((_, index) => c.includes(index)) });
    });
    return componentsVue.map((component, i) => {
        if (i === componentsVue.length - 1) {
            return component;
        }
        else {
            let nameComposition = [...component.properties].sort((p) => p.name.length)[0].name;
            nameComposition = nameComposition.charAt(0).toUpperCase() + nameComposition.slice(1);
            return {
                components: [],
                name: `Composition${componentVue.name}${nameComposition}`,
                props: [],
                properties: component.properties
            };
        }
    });
};
//# sourceMappingURL=compositionDivide.js.map