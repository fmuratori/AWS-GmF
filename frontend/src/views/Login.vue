<template lang="pug">
b-row.justify-content-center(no-gutters='no-gutters')
  b-col(:lg='isLoginSelected ? 3 : 5' md='8' cols='10')
    b-card#login.shadow-lg.mt-5.mb-5(no-body='no-body')
      #login-header.px-5.py-4
        b-row(align-h='center')
          b-icon-person-circle(font-scale='3')
        b-row(align-h='center')
          h2 Bring me Food
      b-button-group(block='block')
        b-button.login-section-button(variant='light' @click='isLoginSelected = true' :class="{ 'login-selected-button': isLoginSelected }") Sign in
        b-button.login-section-button(variant='light' @click='isLoginSelected = false' :class="{ 'login-selected-button': !isLoginSelected }") Sign up
      b-form(@submit.stop.prevent='submitForm')
        .p-5(v-if='isLoginSelected')
          p.text-danger(v-if='showLoginErrorMessage') Invalid email or password.
          h5.text-center.mt-4 Credentials
          InputText(placeholder='Insert your email' type='email' icon='at' required='required' :text='login.email' @data='(e) => { login.email = e; }')
          InputText(placeholder='Insert your password' type='password' icon='key' required='required' :text='login.password' @data='(e) => { login.password = e; }')
          b-row.justify-content-md-center.mb-4
            a(href='#') Forgot password?
        .p-3(v-else)
          h5.text-center.mt-4 Personal information
          InputText(title='Name: ' placeholder='Insert name here' required='required' @data='(e) => { registration.name = e; }')
          InputText(title='Surname: ' placeholder='Insert surname here' required='required' @data='(e) => { registration.surname = e; }')
          InputText(title='Email: ' placeholder='Insert your email here' type='email' required='required' @data='(e) => { registration.email = e; }')
          InputText(title='Phone number: ' placeholder='Insert your phone number here' required='required' @data='(e) => { registration.phoneNumber = e; }')
          hr
          InputAddress(@data='(e) => { registration.address = e; }' @addressupdate='onAddressUpdate')
          InputPasswordSelect(title1='Password: ' title2='Repeat your password: ' placeholder1='Insert your password here' placeholder2='Repeat your password here' @data='(e) => { registration.password = e; }')
          hr
          b-form-checkbox#checkbox-1.mt-4(name='checkbox-1' v-model='registrationPrivacyChecked')
            i
              | I agree to the
              a(href='#') privacy policy
          b-form-checkbox#checkbox-2.mt-2(name='checkbox-2')
            i I want to receive marketing information (optional)
        b-button.footerCardButton.color3(block='block' size='lg' type='submit')
          span(v-if='isLoginSelected') SIGN IN
          span(v-else) SIGN UP
          Icon(bootstrap icon='chevron-right' aria-hidden='true' font-scale='1')
      button(@click="login.email = 'user@user.com'") Utente
      button(@click="login.email = 'volunteer@volunteer.com'") Volontario
      button(@click="login.email = 'trusted@trusted.com'") Trusted


</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputPasswordSelect from "../components/input/InputPasswordSelect.vue";
import Icon from "../components/Icon.vue";

import sha from "../misc/sha";

import userApi from "../api/user";
import chatApi from "../api/chat";
import {
  LoginPayload,
  RegistrationPayload,
  Address,
  LoginResponse,
  UserData,
} from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "Login",
  components: {
    InputText,
    InputAddress,
    InputPasswordSelect,
    Icon,
  },
  data: () => {
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
            y: 0,
          },
        } as Address,
      } as RegistrationPayload,
    };
  },
  created() {
    this.$store.dispatch("hideSidebar");
  },
  methods: {
    onAddressUpdate(address: string) {
      this.registration.address = address;
    },
    submitForm() {
      if (this.isLoginSelected) {
        eventbus.$emit("startLoading", "Checking your log in credentials");
        this.login.password = sha.hashText(this.login.password);
        userApi
          .loginRequest(this.login)
          .then((r: AxiosResponse<LoginResponse>): void => {
            if (r.status == 200) {
              this.$cookies.set("jwt", r.data.token);
              this.$cookies.set("user-id", r.data.user._id);

              this.$store.dispatch("login", {
                token: r.data.token as string,
                userData: r.data.user as UserData,
              });

              this.showLoginErrorMessage = false;
              this.$router.push({ name: "Home" });

              // initialize a socket session (let the server know that a new logged user is active)
              this.$socket.emit(
                "login",
                this.$store.state.session.userData._id
              );

              chatApi
                .unreadMessages(this.$store.state.session.userData._id)
                .then((r: AxiosResponse): void => {
                  this.$store.dispatch("updateUnreadMessages", r.data);
                })
                .catch((e: AxiosError): void => console.log(e));
            }
          })
          .catch((e: AxiosError): void => {
            console.log(e);
            this.showLoginErrorMessage = true;
          })
          .then(() => {
            eventbus.$emit("stopLoading");
          });
      } else {
        eventbus.$emit("startLoading", "Adding your data to our systems");
        this.registration.password = sha.hashText(this.registration.password);
        userApi
          .registrationRequest(this.registration)
          .then(() => {
            this.isLoginSelected = true;
            eventbus.$emit(
              "successMessage",
              "Registration",
              "Registration completed successfully."
            );
          })
          .catch((e) => {
            console.log(e);
            eventbus.$emit(
              "errorMessage",
              "Registration",
              "An unexpected error occurred during your registration. Retry later or contact us if the problem persists."
            );
          })
          .then(() => {
            eventbus.$emit("stopLoading");
          });
      }
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

.login-section-button {
  border-radius: 0px;
}

.login-select-button:focus {
  outline: none;
  box-shadow: none;
}

.login-selected-button {
  border-bottom: 2px solid $greyscaleD;
}
</style>
