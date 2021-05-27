export const transformObjectToArrayWithName = (object) => {
    const dataKeys = Object.keys(object);
    return dataKeys.map((value) => ({
        name: value,
        id: value,
        value: object[value]
    }));
};
export const transformObjectToArray = (object) => {
    return Object.keys(object).map((value) => value);
};
//# sourceMappingURL=transform.js.map