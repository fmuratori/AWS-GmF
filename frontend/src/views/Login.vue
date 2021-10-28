<template lang="pug">
  b-row(class="justify-content-md-center" no-gutters)
    b-col(:cols="isLoginSelected ? 'auto' : 4")
      
      b-card(no-body id="login" class="shadow-lg mt-5 mb-5")
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
            div(class="p-5")
              h5(class="mt-4") Credenziali
              b-form-group(id="input-group-11" label="" label-for="input-11")
                b-input-group()
                  b-input-group-prepend
                    b-input-group-text
                      b-icon(icon="at")
                  b-form-input(id="input-11" type="email" placeholder="Inserisci email" required v-model="login.email")
              b-form-group(id="input-group-22" label="" label-for="input-22")
                b-input-group()
                  b-input-group-prepend
                    b-input-group-text
                      b-icon(icon="key")
                  b-form-input(id="input-22" type="password" placeholder="Inserisci password" required v-model="login.password")
              b-row(class="justify-content-md-center" class="mb-4")
                a(href="#") Ti sei dimenticato la password?
          
            b-button(block class="login-button" size="lg" @click="loginRequest")
              span ACCEDI
              b-icon(icon="chevron-right" aria-hidden="true" font-scale="1")

          div(v-else)
            div(class="p-3" )
              h5 Informazioni personali

              b-form-group(id="input-group-1" label="Nome:" label-for="input-1")
                b-form-input(id="input-1" type="text" v-model="registration.name" placeholder="Inserisci nome" required)

              b-form-group(id="input-group-2" label="Cognome:" label-for="input-2")
                b-form-input(id="input-2" type="text" v-model="registration.surname" placeholder="Inserisci cognome" required)

              b-form-group(id="input-group-3" label="Indirizzo email:" label-for="input-3" 
              description="La tua email non sarà divulgata a terzi.")
                b-form-input(id="input-3" type="email" v-model="registration.email" placeholder="Inserisci email" required)
              
              b-form-group(id="input-group-4" label="Numero di cellulare:" label-for="input-4")
                b-form-input(id="input-4" type="text"  v-model="registration.phoneNumber" placeholder="Inserisci numero di cellulare" required)

              hr

              h5 Luogo di residenza
              
              b-form-group(id="input-group-5" label="Città:" label-for="input-5")
                b-form-input(id="input-5" type="text" v-model="registration.address.city" placeholder="Inserisci città" required)
              
              b-form-group(id="input-group-6" label="Indirizzo:" label-for="input-6")
                b-form-input(id="input-6" type="text" v-model="registration.address.street" placeholder="Inserisci indirizzo" required)
              
              b-form-group(id="input-group-7" label="Numero civico:" label-for="input-1")
                b-form-input(id="input-7" type="text" v-model="registration.address.civicNumber" placeholder="Inserisci numero civico" required)

              hr
              
              b-form-group(id="input-group-8" label="Password:" label-for="input-8" 
              description="Scegli una password efficace, comporta da almeno 8 caratteri tra numeri e lettere maiuscole e minuscole.")
                b-form-input(id="input-8" type="password"  v-model="registration.password" placeholder="Inserisci password" required)

              b-form-group(id="input-group-9" label="Ripeti password:" label-for="input-9")
                b-form-input(id="input-9" type="password" placeholder="Conferma password" required)
          
              hr

              b-form-checkbox(id="checkbox-1" name="checkbox-1" class="mt-4")
                i accetto i termini di servizio e la 
                  a(href="#") privacy policy

              b-form-checkbox(id="checkbox-2" name="checkbox-2" class="mt-2")
                i voglio ricevere email su eventi nella mia città

            b-button(block class="login-button" size="lg" @click="registrationRequest")
              span REGISTRATI
              b-icon(icon="chevron-right" aria-hidden="true" font-scale="1")


</template>

<script lang="ts">
import Vue from "vue";

// import bcrypt from "bcrypt"

import api from "@/api.ts"

export default Vue.extend({
  name: "Login",
  data : function() {
    return {
      isLoginSelected: true,
      login: {
        email: "a", 
        password: "Password1!",
      },
      registration: {
        name: "Fabio",
        surname: "Muratori",
        username: "",
        password: "Password1!",
        email: "a",
        phoneNumber: "1234",
        type: "user",
        address: {
            street: "via a caso",
            civicNumber: "32",
            city: "rimini",
            coordinates: {
                x: 0,
                y: 0
            }
        } 
      }
    }
  },
  created() {
    // console.log("ASD");
    // console.log(bcrypt.hashSync("asd", "a"));
  },
  methods: {
    setLoginSelected(value: boolean) {
      this.isLoginSelected = value;
    },
    loginRequest() {
      

      api.loginRequest(this.login).then(r => {
        console.log(r);
      }).catch(e=>console.log(e));
    },
    registrationRequest() {
      api.registrationRequest(this.registration).then(r => {
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
