"use strict";
exports.__esModule = true;
exports.transformObjectToArray = exports.transformObjectToArrayWithName = void 0;
var transformObjectToArrayWithName = function (object) {
    var dataKeys = Object.keys(object);
    return dataKeys.map(function (value) {
        var _a;
        return (_a = {},
            _a[value] = object[value],
            _a);
    });
};
exports.transformObjectToArrayWithName = transformObjectToArrayWithName;
var transformObjectToArray = function (object) {
    return Object.keys(object)
        .map(function (value) { return value; });
};
exports.transformObjectToArray = transformObjectToArray;
