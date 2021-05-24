import { ComponentOptions } from './types'

const CategoryEdit = 'CategoryEdit'
const CategoryCreate = 'CategoryCreate'

export const exampleInputData: ComponentOptions<any> = {
  name: 'Categories',
  components: { CategoryEdit, CategoryCreate },
  data: () => ({
    some: 'qqq',
    another: 'salam',
    test: ['hello'],
    // boolean: true,
    // number: 0,
    // float: 0.1234,
    // string: 'I am fine',
    // object: {
    //   hello: 'i know'
    // },
    // deepObject: {
    //   deepArray: ['one', ['one', 'two']],
    //   anotherObject: {
    //     wow: 'nice',
    //     bool: false
    //   }
    // },
    // updateCount: 0
  }),
  // provide:{
  //   i:'1',
  // },
  // props: {
  //   item: String,
  //   item2: Number
  // },
  watch: {
    anotherWatcher: (val, old) => {
      // @ts-ignore
      console.log(this.another)
      console.log(val + old)
    },

    someWatcher: (val, old) => {
      // @ts-ignore
      console.log(this.some)
      console.log(val + old)
    },
    someAnotherWatcher: () => {
      // @ts-ignore
      console.log(this.some)
      // @ts-ignore
      console.log(this.another)
    },
    test: () => { 
      // @ts-ignore
      console.log(this.test);
    }
    // deepObject: (val, old) => {
    //   console.log('deepObject watched', val, old)
    // }
  },
  // computed: {
  //   item4() {
  //     // @ts-ignore
  //     return 1 + this.number
  //   }
  // },
  // beforeDestroy(): void {
  //   console.log('bye bye')
  // },
  // mounted() {
  //   const data = {
  //     a: () => {}
  //   }
  // },
  methods: {
    // addNewCategory() {
    //   this.some;
    //   this.another;
    // },
    // updateCategories(category) {
    //   const idx = this.categories.findIndex((c: { id: string }) => c.id === category.id)
    //   this.categories[idx].title = category.title
    //   this.categories[idx].limit = category.limit
    //   this.updateCount++
    // }
  }
}
