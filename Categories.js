import {CategoryEdit,CategoryCreate} from 'path'
import {reactive} from 'vue'
export default {
name: 'Categories',
components: {CategoryEdit,CategoryCreate},
setup(){
let test = reactive(['hello'])
let number = reactive(0)
return {test,
number}
}
}