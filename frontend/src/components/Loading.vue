<template lang="pug">
transition(name='fade')
  #loading(v-if='isActive')
    #background
    b-row.text-center.mt-5(align-v='center' align-h='center')
      b-col(cols='10' md='8' lg='4')
        b-card
          h1
            span Loading...
            .loader  
          p
            label(v-if='message')
              | {{ message }}
              br
            label This action shouldn&apos;t take  too long.
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

export default Vue.extend({
  name: "Loading",
  data: () => {
    return {
      isActive: false,
      message: "",
    };
  },
  created() {
    eventbus.$on("startLoading", (message: string) => {
      this.isActive = true;
      this.message = message;
    });
    eventbus.$on("stopLoading", () => {
      this.isActive = false;
      this.message = "";
    });
  },
});
</script>

<style scoped lang="scss">
// @import "@/assets/style.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#loading {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999999999;
  overflow: hidden;
}

#background {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  background: #ccc;
  opacity: 0.8;
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(89, 89, 89, 0.2);
  border-right: 1.1em solid rgba(89, 89, 89, 0.2);
  border-bottom: 1.1em solid rgba(89, 89, 89, 0.2);
  border-left: 1.1em solid #595959;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
