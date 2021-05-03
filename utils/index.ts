import { ComponentOptions, KeysType } from './types'
import { transformObjectToArray, transformObjectToArrayWithName } from './utils'
import { toVue3HookName } from './utils/vue2'


import { create } from './create';

const CategoryEdit = 'CategoryEdit'
const CategoryCreate = 'CategoryCreate'

const exampleInputData: ComponentOptions<any> = {
  name: 'Categories',
  components: {CategoryEdit, CategoryCreate},
  data: () => ({
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
        bool: false,
      }
    },
    updateCount: 0
  }),
  props: {
    item: String,
    item2: Number
  },
  watch: {
    item3: (val, old) => {
      console.log(val+old)
    },
    deepObject: (val, old) => {
      console.log('deepObject watched')
    }
  },
  computed: {
    item4() {
      return 1 + 2
    }
  },
  beforeDestroy(): void {
    console.log('bye bye')
  },
  mounted() {
    const data = {
      a: () => {
      }
    }
    this.loading = false
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    },
    updateCategories(category) {
      const idx = this.categories
                      .findIndex(c => c.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.updateCount++
    }
  }
}


function parser(input: ComponentOptions<any>) {
  const keys: Array<KeysType> = Object.keys(input) as any
  const result: any = {}
  keys.forEach((i) => {

    const item = input[i]
    switch (i) {
      case 'data': {
        const data = typeof item === 'object' ? item : item()
        result[i] = transformObjectToArrayWithName(data)
        break
      }
      case 'props': {
        result[i] = item.slice
          ? item
          : transformObjectToArray(item)
        break
      }
      case 'watch': {
        result[i] = Object.keys(item).map(key => {
            const watchItem = item[key]
            let watchResult = {}
            if (watchItem === 'object') {
              watchItem['name'] = key
              watchResult = {...watchItem, name: key}
            } else {
              watchResult = {handler: watchItem, name: key}
            }
            return watchResult
          }
        )
        break
      }
      case 'computed': {
        result[i] = transformObjectToArrayWithName(item)
        break
      }
      case 'methods': {
        result[i] = transformObjectToArrayWithName(item)

        break
      }
      case 'mounted':
      case 'beforeCreate':
      case 'beforeDestroy':
      case 'beforeMount':
      case 'beforeUpdate':
      case 'created':
      case 'updated':
      case 'destroyed': {
        result[toVue3HookName(i)] = item
        break
      }
      case 'components': {
        result[i] = transformObjectToArray(item)
        break
      }
      case 'name': {
        result[i] = item
        break
      }
    }
  })
  return result
}

const parsedObject = parser(exampleInputData)

const result = create(parsedObject)

export default (text: string) => {
  // @ts-ignore
  return create(parser(JSON.stringify(text)))
}
