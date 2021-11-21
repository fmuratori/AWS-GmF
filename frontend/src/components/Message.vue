<template lang="pug">
  p(class="message m-1 p-2" :class="{'my-message': isOwner}")
    label(class="font-weight-bolder m-0 p-0") {{ username }}
    span(v-for="(msg, idx) in messages" :index="idx")
      br
      label(class="m-0 p-0") {{ msg }}
    span()
      br
      label(class="m-0 p-0 font-italic") {{ date }}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Message",
  props: {
    isOwner: Boolean,
    username: String,
    messages: Array,
    date: String,
    isVisualized: Boolean,
  },
  data: function () {
    return {};
  },
  methods: {},
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.message {
  display: block;
  background-color: $othersMessageColor;
  border-radius: 5px;
}

.my-message {
  background-color: $myMessageColor;
  text-align: right;
}
</style>
