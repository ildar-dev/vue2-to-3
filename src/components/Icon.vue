<template>
<svg xmlns="http://www.w3.org/2000/svg"
     :width="width"
     :height="height"
     viewBox="0 0 16 16"
     :class="className">
<g :fill="iconColor">
<slot/>
</g>
</svg>
</template>

<script>
  /**
   * Represents a base-icon component
   * @vue-prop {String,Number} width -  width attribute of svg
   * @vue-prop {String,Number} height -  height attribute of svg
   * @vue-prop {String} iconColor - fill attribute of svg
   * @vue-prop {String} className - string of css classes
   */
  export default {
    props: {
      width: {
        type: [Number, String],
        default: '1.5em'
      },
      height: {
        type: [Number, String],
        default: '1.5em'
      },
      iconColor: {
        type: String,
        default: 'green'
      },
      className: {
        type: String,
        default: ''
      }
    }
  }
</script>
