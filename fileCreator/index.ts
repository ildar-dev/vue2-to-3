import { parser } from '../divider/parser';
import { divide } from '../helpers/compositionDivide';
import { stringify } from '../helpers/create';
import { exampleInputData } from '../helpers' // TODO api

const output = ''; // TODO API

import fs from 'fs';


const parsedObject = parser(exampleInputData)

const dividedObject = divide(parsedObject!);

// const stringified = dividedObject.map(d => stringify(d));

dividedObject.forEach((d) => {
  fs.writeFile(`${output}${d.name}.js`, stringify(d), function (err) {
    if (err) throw err;
    console.log('Saved!');
  })
})
