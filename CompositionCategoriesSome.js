import {reactive} from 'vue'
export default {
name: 'CompositionCategoriesSome',
setup(){
let some = reactive(9)
watch(function () {
            // @ts-ignore
            this.some--;
        },function () {
            // @ts-ignore
            this.some++;
        },function () {
            // @ts-ignore
            _this.some++;
            // @ts-ignore
            _this.another++;
        })
return {some,
someWatcher,
someWatcher1,
someAnotherWatcher}
}
}