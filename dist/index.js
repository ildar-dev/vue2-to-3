var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import { parser } from './parser';
import { divide, stringify } from './helpers';
export const fileCreator = (filePath, _options) => __awaiter(void 0, void 0, void 0, function* () {
    const input = yield import(path.join(import.meta.url, '../../', filePath));
    const defaultObject = input.default;
    const parsedObject = parser(defaultObject);
    const dividedObject = divide(parsedObject);
    dividedObject.forEach((d) => {
        const split = filePath.split('/');
        fs.writeFile(`${''}${d.name}.js`, stringify(d), function (err) {
            if (err)
                throw err;
            console.log('Success!');
        });
    });
});
const filePath = process.argv[2];
fileCreator(filePath);
//# sourceMappingURL=index.js.map