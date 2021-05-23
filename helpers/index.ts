import { ComponentOptions } from './types'

const CategoryEdit = 'CategoryEdit'
const CategoryCreate = 'CategoryCreate'

export const exampleInputData: ComponentOptions<any> = {
  name: 'Categories',
  components: { CategoryEdit, CategoryCreate },
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
        bool: false
      }
    },
    updateCount: 0
  }),
  provide(){
    const appData = {}



    return {

      // @ts-ignore
      updateCheckoutInfo: this.array,
      appData,
    }
  },
  props: {
    item: String,
    item2: Number
  },
  watch: {
    item3: (val, old) => {
      // @ts-ignore
      console.log(this.array)
      console.log(val + old)
    },
    deepObject: (val, old) => {
      console.log('deepObject watched', val, old)
    }
  },
  computed: {
    item4() {
      // @ts-ignore
      return 1 + this.number
    }
  },
  beforeDestroy(): void {
    console.log('bye bye')
  },
  mounted() {
    const data = {
      a: () => {}
    }
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    },
    updateCategories(category) {
      const idx = this.categories.findIndex((c: { id: string }) => c.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.updateCount++
    }
  }
}
