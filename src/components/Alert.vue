<template>
<div class="transition pos m-auto" :class="{'hidden': isHidden}">
<div class="neo p-2 pl-4 pr-4 text-nowrap">
{{data}}
</div>
</div>
</template>

<script>
  /**
   * Represents a message alert box
   * @vue-data {Boolean} isHidden - flag for visibility
   * @vue-data {String} data - text from alert event
   * @vue-data {Integer} timeout - timeout id for animation
   * @vue-event {Void} change - handler for alert event
   */
  export default {
    name: 'Alert',
    data: () => ({
      isHidden: true,
      data: '',
      timeout: null
    }),
    methods: {
      change(data) {
        this.data = data
        this.isHidden = false
        clearTimeout(this.timeout) // needed if the alarm is faster than 2600ms
        this.timeout = setTimeout(() => {
          this.isHidden = true
        }, 2600)
      }
    },
    created() {
      this.$eventHub.$on('alert', this.change)
    },
    beforeDestroy() {
      this.$eventHub.off('alert') // need if we decide destroy element
    }
  }
</script>

<style scoped>
.pos {
z-index: 100;
position: fixed;
top: 13px;
left: 50%;
transform: translate(-50%, 0);
}
</style>
