"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var utils_1 = require("./utils");
var vue2_1 = require("./utils/vue2");
var create_1 = require("./create");
var CategoryEdit = 'CategoryEdit';
var CategoryCreate = 'CategoryCreate';
var exampleInputData = {
    name: 'Categories',
    components: { CategoryEdit: CategoryEdit, CategoryCreate: CategoryCreate },
    data: function () { return ({
        array: ['hello'],
        boolean: true,
        number: 0,
        float: 0.1234,
        string: 'I am fine',
        object: {
            hello: 'i know'
        },
        deepObject: {
            deepArray: ['one', ['one', 'two']],
            anotherObject: {
                wow: 'nice',
                bool: false
            }
        },
        updateCount: 0
    }); },
    props: {
        item: String,
        item2: Number
    },
    watch: {
        item3: function (val, old) {
            console.log(val + old);
        },
        deepObject: function (val, old) {
            console.log('deepObject watched');
        }
    },
    computed: {
        item4: function () {
            return 1 + 2;
        }
    },
    beforeDestroy: function () {
        console.log('bye bye');
    },
    mounted: function () {
        var data = {
            a: function () {
            }
        };
        this.loading = false;
    },
    methods: {
        addNewCategory: function (category) {
            this.categories.push(category);
        },
        updateCategories: function (category) {
            var idx = this.categories
                .findIndex(function (c) { return c.id === category.id; });
            this.categories[idx].title = category.title;
            this.categories[idx].limit = category.limit;
            this.updateCount++;
        }
    }
};
function parser(input) {
    var keys = Object.keys(input);
    var result = {};
    keys.forEach(function (i) {
        var item = input[i];
        switch (i) {
            case 'data': {
                var data = typeof item === 'object' ? item : item();
                result[i] = utils_1.transformObjectToArrayWithName(data);
                break;
            }
            case 'props': {
                result[i] = item.slice
                    ? item
                    : utils_1.transformObjectToArray(item);
                break;
            }
            case 'watch': {
                result[i] = Object.keys(item).map(function (key) {
                    var watchItem = item[key];
                    var watchResult = {};
                    if (watchItem === 'object') {
                        watchItem['name'] = key;
                        watchResult = __assign(__assign({}, watchItem), { name: key });
                    }
                    else {
                        watchResult = { handler: watchItem, name: key };
                    }
                    return watchResult;
                });
                break;
            }
            case 'computed': {
                result[i] = utils_1.transformObjectToArrayWithName(item);
                break;
            }
            case 'methods': {
                result[i] = utils_1.transformObjectToArrayWithName(item);
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
                result[vue2_1.toVue3HookName(i)] = item;
                break;
            }
            case 'components': {
                result[i] = utils_1.transformObjectToArray(item);
                break;
            }
            case 'name': {
                result[i] = item;
                break;
            }
        }
    });
    return result;
}
var parsedObject = parser(exampleInputData);
var result = create_1.create(parsedObject);
exports["default"] = (function (text) {
    // @ts-ignore
    return create_1.create(parser(JSON.stringify(text)));
});
