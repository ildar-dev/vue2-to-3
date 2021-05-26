import {reactive} from 'vue'
export default {
name: 'CompositionCategoriesAnother',
setup(){
let another = reactive(9)
watch(function () {
            // @ts-ignore
            this.another;
        })
return {another,
anotherWatcher}
}
}