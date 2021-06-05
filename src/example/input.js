const CategoryEdit = 'CategoryEdit'
const CategoryCreate = 'CategoryCreate'

export default {
  name: 'Categories',
  components: { CategoryEdit, CategoryCreate },
  data: () => ({
    some: 9,
    another: 9,
    test: ['hello'],
    number: 0
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
  mounted() {
    console.log('qqq');
  },
  // provide:{
  //   i:'1',
  // },
  // props: {
  //   item: String,
  //   item2: Number
  // },
  watch: {
    anotherWatcher: function () {
      this.another
    },

    someWatcher: function () {
      this.some--
    },
    someWatcher1: function () {
      this.some++
    },
    someAnotherWatcher: function () {
      this.some++
      this.another++
    }
    // test: () => {
    //   // @ts-ignore
    //   this.test;
    // }
    // deepObject: (val, old) => {
    //   console.log('deepObject watched', val, old)
    // }
  },
  computed: {
    // item4() {
    //   // @ts-ignore
    //   return 1 + this.number
    // }
  },
  // beforeDestroy(): void {
  //   // @ts-ignore
  //   this.some++;
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
