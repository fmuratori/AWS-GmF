<template lang="pug">
b-row.justify-content-center(no-gutters)
  b-col(md="auto", xs=12)
    b-card#login.shadow-lg.mt-5.mb-5(no-body)
      #login-header.px-5.py-4
        b-row(align-h="center")
          b-icon-person-circle(font-scale="3")
        b-row(align-h="center")
          h2 Bring me Food

      b-button-group(block)
        b-button.login-select-button(
          variant="light",
          @click="isLoginSelected = true",
          :class="{ 'login-selected-button': isLoginSelected }"
        ) Sign in
        b-button.login-select-button(
          variant="light",
          @click="isLoginSelected = false",
          :class="{ 'login-selected-button': !isLoginSelected }"
        ) Sign up

      b-form(@submit="submitForm")
        .p-3(v-if="isLoginSelected")
          p.text-danger(v-if="showLoginErrorMessage") Invalid email or password.
          h5.mt-4 Credentials

          InputText(
            placeholder="Insert your email",
            type="email",
            icon="at",
            required,
            :text="login.email",
            v-on:data="(e) => { login.email = e; }"
          )

          InputText(
            placeholder="Insert your password",
            type="password",
            icon="key",
            required,
            :text="login.password",
            v-on:data="(e) => { login.password = e; }"
          )

          b-row.justify-content-md-center.mb-4
            a(href="#") Forgot password?

        .p-3(v-else)
          h5.mt-4 Personal information

          InputText(
            title="Name: ",
            placeholder="Insert name here",
            required,
            v-on:data="(e) => { registration.name = e; }"
          )

          InputText(
            title="Surname: ",
            placeholder="Insert surname here",
            required,
            v-on:data="(e) => { registration.surname = e; }"
          )

          InputText(
            title="Email: ",
            placeholder="Insert your email here",
            type="email",
            required,
            v-on:data="(e) => { registration.email = e; }"
          )

          InputText(
            title="Phone number: ",
            placeholder="Insert your phone number here",
            required,
            v-on:data="(e) => { registration.phoneNumber = e; }"
          )

          InputAddress(
            title="Location",
            ref="inputAddress"
          )

          InputPasswordSelect(
            title1="Password: ",
            title2="Repeat your password: ",
            placeholder1="Insert your password here",
            placeholder2="Repeat your password here",
            v-on:data="(e) => { registration.password = e; }"
          )

          hr

          b-form-checkbox#checkbox-1.mt-4(
            name="checkbox-1",
            v-model="registrationPrivacyChecked"
          )
            i I agree to the
              a(href="#") privacy policy

          b-form-checkbox#checkbox-2.mt-2(name="checkbox-2")
            i I want to receive marketing information (optional)

        b-button.login-button(block, size="lg", type="submit")
          span(v-if="isLoginSelected") SIGN IN
          span(v-else) SIGN UP
          b-icon(icon="chevron-right", aria-hidden="true", font-scale="1")

      button(@click="login.email = 'user@user.com'") Utente
      button(@click="login.email = 'volunteer@volunteer.com'") Volontario
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosError } from "axios";
import InputText from "../components/input/InputText.vue";
import InputTextarea from "../components/input/InputTextarea.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputPasswordSelect from "../components/input/InputPasswordSelect.vue";

// import bcrypt from "bcrypt"

import userApi from "../api/user";
import chatApi from "../api/chat";
import { LoginPayload, RegistrationPayload, Address } from "../types";

export default Vue.extend({
  name: "Login",
  components: {
    InputText,
    InputTextarea,
    InputAddress,
    InputPasswordSelect,
  },
  data: function () {
    return {
      // TODO: remove precompiled test-values
      isLoginSelected: true,
      showLoginErrorMessage: false,
      registrationPrivacyChecked: false,
      login: {
        email: "volunteer@gmail.com",
        password: "Password2021!",
      } as LoginPayload,
      registration: {
        name: "",
        surname: "",
        password: "",
        email: "",
        phoneNumber: "",
        address: {
          street: "",
          civicNumber: "",
          city: "",
          coordinates: {
            x: 0,
            y: 0
          },
        } as Address,
      } as RegistrationPayload,
    };
  },
  created() {
    this.$store.dispatch("hideSidebar");
  },
  methods: {
    submitForm(event) {
      event.preventDefault();

      if (this.isLoginSelected) {
        userApi
          .loginRequest(this.login)
          .then((r: any) => {
            if (r.status == 200) {
              this.$store.dispatch("login", {
                token: r.data.data.token,
                userData: r.data.data.user,
              });
              this.showLoginErrorMessage = false;
              this.$router.replace({ name: "Home" });

              // initialize a socket session (let the server know that a new logged user is active)
              this.$socket.emit(
                "login",
                this.$store.state.session.userData._id
              );

              chatApi
                .unreadMessages(this.$store.state.session.userData._id)
                .then((r: any) => {
                  this.$store.dispatch(
                    "updateUnreadMessages",
                    r.data.data.counts
                  );
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e: AxiosError): void => {
            console.log(e);
            this.showLoginErrorMessage = true;
          });
      } else {
        this.registration.address = this.$refs.inputAddress.address;
        userApi
        .registrationRequest(this.registration)
        .then(() => {
          this.isLoginSelected = true;
          this.$bvToast.toast(
            `Operazione avvenuta con successo. Effettua il login per accedere.`,
            {
              title: "Registrazione",
              autoHideDelay: 5000,
              variant: "success",
              appendToast: false,
            }
          );
        })
        .catch((e) => {
          console.log(e);
          this.$bvToast.toast(
            `Errore durante la fase di registrazione, riprova.`,
            {
              title: "Registrazione",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
      }
    },
    temp(v: string) {
      if (v == "user") this.login.email = "user@user.com";
      else this.login.email = "volunteer@volunteer.com";
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/style.scss";

#login-header {
  color: $color1;
  background-color: $greyscaleE;

  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
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
