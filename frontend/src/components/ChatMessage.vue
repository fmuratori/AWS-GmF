<template lang="pug">
div
  p.message.m-1.p-2(v-if='!isEvent' :class="{'my-message': isOwner}")
    label.font-weight-bolder.m-0.p-0 {{ isOwner ? &quot;You&quot; : username }}
    span(v-for='(msg, idx) in messages' :index='idx')
      br
      label.m-0.p-0 {{ msg }}
    span
      br
      small.m-0.p-0.font-italic {{ date }}
  p.message.m-1.p-2.text-center(v-else)
    label.m-0.p-0 {{ messages[0] }}
    br
    small.m-0.p-0 {{ date }}
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
    isEvent: Boolean,
  },
  data: () => {
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
