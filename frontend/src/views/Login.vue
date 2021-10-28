<template lang="pug">
  b-row(class="justify-content-md-center" no-gutters)
    b-col(cols="auto")
      
      b-card(no-body id="login" class="shadow-lg mt-5")
        div(id="login-header" class="px-5 py-4")
          b-row(align-h="center")
            b-icon-person-circle(font-scale="3")
          b-row(align-h="center")
            h2() Bring me Food

        b-button-group(block)
          b-button(variant="light" @click="setLoginSelected(true)" class="login-select-button" :class="{'login-selected-button': isLoginSelected}") Accedi
          b-button(variant="light" @click="setLoginSelected(false)" class="login-select-button" :class="{'login-selected-button': !isLoginSelected}") Registrati

        div(id="login-body")
          div(v-if="isLoginSelected")
            div(class="p-3" )
              b-input-group(class="mt-4")
                b-input-group-prepend
                  b-input-group-text
                    b-icon(icon="at")
                b-form-input
              b-input-group(class="mt-2 mb-4")
                b-input-group-prepend
                  b-input-group-text
                    b-icon(icon="key")
                b-form-input
              b-row(class="justify-content-md-center" class="mb-4")
                a(href="#") Ti sei dimenticato la password?
          
            b-button(block class="login-button" size="lg")
              span ACCEDI
              b-icon(icon="chevron-right" aria-hidden="true" font-scale="1")

          div(v-else)
            div(class="p-3" )
              b-input-group(class="mt-4")
                b-input-group-prepend
                  b-input-group-text
                    b-icon(icon="person-fill")
                b-form-input
              b-input-group(class="mt-2")
                b-input-group-prepend
                  b-input-group-text
                    b-icon(icon="person-fill")
                b-form-input
              b-input-group(class="mt-2")
                b-input-group-prepend
                  b-input-group-text
                    b-icon(icon="envelope")
                b-form-input
              b-input-group(class="mt-2")
                b-input-group-prepend
                  b-input-group-text
                    b-icon(icon="telephone")
                b-form-input
              b-input-group(class="mt-2 mb-4")
                b-input-group-prepend
                  b-input-group-text
                    b-icon(icon="key")
                b-form-input
          
            b-button(block class="login-button" size="lg")
              span REGISTRATI
              b-icon(icon="chevron-right" aria-hidden="true" font-scale="1")


</template>

<script lang="ts">
import Vue from "vue";

import api from "@/api.ts"

export default Vue.extend({
  name: "Login",
  data : function() {
    return {
      isLoginSelected: true,
      loginUsername: "",
      loginPassword: "",

    }
  },
  methods: {
    setLoginSelected(value: boolean) {
      this.isLoginSelected = value;
    },
    login() {
      const payload = {
        "username": "admin4",
        "password": "Password2021!"
      }
      api.loginRequest(payload).then(r => {
        console.log(r);
      }).catch(e=>console.log(e));
    },
  }
});
</script>
<style lang="scss">
@import "@/assets/style.scss";

#login {
  border: 0px;
  padding: 0px;
}

#login-header {
  color: $color1; 
  background-color: $greyscaleE;

  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.login-select-button {
  border-radius:0;
}
.login-select-button:focus {
  outline: none;
  box-shadow: none;
}

.login-selected-button {
  border-bottom: 1px solid $greyscaleD;
}

.login-button {
  background-color: $color3;

  border: 0px;

  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
</style>
