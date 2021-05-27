import fs from 'fs'
import path from 'path'
import { parser } from './parser'
import { divide, stringify } from './helpers'

// import { exampleInputData } from '../helpers' // TODO api

// const output = '' // TODO API

export const fileCreator = async (filePath: string, _options?: unknown): Promise<void> => {
  const input = await import(path.join(import.meta.url, '../../', filePath))
  const defaultObject = input.default
  const parsedObject = parser(defaultObject)

  const dividedObject = divide(parsedObject)

  dividedObject.forEach((d) => {
    const split = filePath.split('/')
    // const pathResult = path.slice(0, split.length - 1)
    fs.writeFile(`${ '' }${ d.name }.js`, stringify(d), function(err) {
      if (err) throw err
      console.log('Success!')
    })
  })
}

const filePath = process.argv[2]
fileCreator(filePath)
