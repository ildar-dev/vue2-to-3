<template>
  <div class="hello">
    <Alert/>
    <p>Welcome</p>
    <p>it is a migration service from Vue-2 to Vue-3</p>
    <div class="container">
      <Import @import="onImport" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'

import Import from './Import.vue'
import Alert from './Alert';

const parser = (str) => {
  return Function(`return ${str}`)
};

export default {
  name: 'Main',
  components: {
    Import,
    Alert,
  },
  methods: {
    onImport(data) {
      console.log(data)
      const start = data.indexOf(`export default`)
      const finish = data.indexOf(`</scri${''}pt>`)
      const preres = data.slice(start,finish)
      const startJ = preres.indexOf('{')
      const result = preres.slice(startJ)
      console.log(result)
      const v = parser(`new Vue(${result})`).bind(this)()
      // eslint-disable-next-line no-undef
      console.log(v);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.neo{
  border-radius: 26px;
  transition: all ease-out 400ms;
  background: #ffffff;
  box-shadow: 6px 6px 11px #d9d9d9,
  -6px -6px 11px #ffffff;
}
.neo:hover {
  box-shadow: 5px 5px 10px #919191,
  -5px -5px 10px #ffffff;
}
.add {
  border: 1px solid green;
  color: green
}
.size {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name {
  font-size: 30px;
  height: 40px;
  border-bottom: 1px solid green;
}

.input {
  padding: 0;
  margin: 1px;
  border: 0;
  outline: none;
  vertical-align: baseline;
  color: green;
}

.select {
  color: white;
  background: green;
}

.drag {
  border-radius: 26px;
  border: 1px dashed green;
  color: green;
}

.transition {
  transition: all ease-out 400ms;
}

.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.4s;
  max-height: 40px;
}

.fadeHeight-enter,
.fadeHeight-leave-to {
  opacity: 0;
  max-height: 0;
}

.hidden {
  visibility: hidden;
  opacity: 0.001;
}

</style>
