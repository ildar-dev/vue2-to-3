import { ComponentOptions, KeysType } from './types'
import { transformObjectToArray, transformObjectToArrayWithName } from './utils'
import { toVue3HookName } from './utils/vue2'

(Function.prototype as any).argumentNames = function () {
  const names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
    .replace(/\s+/g, '').split(',')
  return names.length == 1 && !names[0] ? [] : names
}

const CategoryEdit = 'CategoryEdit'
const CategoryCreate = 'CategoryCreate'

const exampleInputData: ComponentOptions<any> = {
  name: 'Categories',
  components: {CategoryEdit, CategoryCreate},
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  props: {
    item: String,
    item2: Number
  },
  watch: {
    item3: (val, old) => {
    }
  },
  computed: {
    item4() {
      return 1 + 2
    }
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
}

parser(exampleInputData)
