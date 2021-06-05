#!/usr/bin/env node --experimental-specifier-resolution=node

import fs from 'fs'
import url from 'url'
import path from 'path'
import { parser } from './parser'
import { divide, stringify } from './helpers'

// import { exampleInputData } from '../helpers' // TODO api

// const output = '' // TODO API

export const fileCreator = async (filePath: string, _options?: unknown): Promise<void> => {
  if (!filePath?.length) {
    console.log('Provide path to .js file with vue2 exported object\nExample: migrate ./src/components/HelloWorld.js');
    return;
  }

  const input = await import(url.pathToFileURL(path.join(process.cwd(), filePath)).href)

  const defaultObject = input.default
  const parsedObject = parser(defaultObject)
  if (!parsedObject.name?.length) {
    const split = filePath.split('/');
    parsedObject.name = split[split.length - 1].split('.').slice(0, -1).join('.') // instead of name in object use file name
  }
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
