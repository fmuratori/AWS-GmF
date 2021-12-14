<template lang="pug">
b-container.mb-5
  b-row.justify-content-md-center.no-gutters
    b-col(lg='6' md='8' cols='11')
      .my-5
        hr.shaded
        h4.text-center
          b(v-if="mode == 'password'") CHANGE PASSWORD
          b(v-if="mode == 'user_info'") USER INFO
          b(v-if="mode == 'address'") ADDRESS
        hr.shaded

      b-form(v-if="mode == 'password'" @submit.stop.prevent='changePassword')
        
        InputText.mb-5(title='Old password:' placeholder='Insert your old password here' type='password' required :text='changePasswordForm.oldPassword' @data='(e) => { changePasswordForm.oldPassword = e; }')
        InputPasswordSelect(title1='New password: ' title2='Confirm new password: ' placeholder1='Insert your password here' placeholder2='Repeat your password here' @data='(e) => { changePasswordForm.newPassword = e; }')
        b-row
          b-col
            b-button(block='block' variant='secondary' @click="$router.push({name: 'Home'})") Cancel
          b-col
            b-button.color3(block='block' type='submit') Edit
      b-form(v-if="mode == 'user_info'" @submit.stop.prevent='editUser')
        InputText(title='Name: ' placeholder='Insert name here' required :text='form.name' @data='(e) => { form.name = e; }')
        InputText(title='Surname: ' placeholder='Insert surname here' required :text='form.surname' @data='(e) => { form.surname = e; }')
        InputText(title='Email: ' placeholder='Insert your email here' type='email' required :text='form.email' @data='(e) => { form.email = e; }')
        InputText(title='Phone number: ' placeholder='Insert your phone number here' required :text='form.phoneNumber' @data='(e) => { form.phoneNumber = e; }')
        b-row
          b-col
            b-button(block='block' variant='secondary' @click="$router.push({name: 'Home'})") Cancel
          b-col
            b-button.color3(block='block' type='submit') Edit
      b-form(v-if="mode == 'address'" @submit.stop.prevent='editUser')
        InputAddress.mb-3(:city='form.address.city' :civic='form.address.civicNumber' :street='form.address.street' :x='form.address.coordinates.x' :y='form.address.coordinates.y' @data='(e) => { form.address = e; }')
        b-row
          b-col
            b-button(block='block' variant='secondary' @click="$router.push({name: 'Home'})") Cancel
          b-col
            b-button.color3(block='block' type='submit') Edit

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import sha from "../misc/sha";

import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputPasswordSelect from "../components/input/InputPasswordSelect.vue";

import { Address, UserData, changePasswordPayload } from "../types";
import { ManagerEditUserInfoView } from "../types/viewTypes";

import api from "../api/user";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerEditUserInfo",
  components: {
    InputText,
    InputPasswordSelect,
    InputAddress,
  },
  data: (): ManagerEditUserInfoView => {
    return {
      regRepeatPassword: "",
      form: {
        _id: "",
        name: "",
        surname: "",
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
      } as UserData,
      changePasswordForm: {
        id: "",
        oldPassword: "",
        newPassword: "",
      } as changePasswordPayload,
      mode: "",
    };
  },
  created() {
    eventbus.$on("userInfoModeChange", (mode: string) => {
      this.mode = mode;
    });

    if (!("mode" in this.$route.params)) {
      this.$router.push({ name: "Home" });
    } else {
      this.mode = this.$route.params.mode;
    }

    this.form = this.$store.state.session.userData;
    this.changePasswordForm.id = this.$store.state.session.userData._id;
  },
  methods: {
    registrationPasswordCheck() {
      return (
        this.changePasswordForm.newPassword == this.regRepeatPassword &&
        this.changePasswordForm.newPassword != ""
      );
    },
    editUser() {
      eventbus.$emit("startLoading", "Updating your account data");
      api
        .editUser(this.form)
        .then((r: AxiosResponse): void => {
          if (r.status == 200) {
            this.$store.state.session.userData = r.data;
            this.$router.push({ name: "Home" });
            eventbus.$emit(
              "successMessage",
              "User data",
              "Account information successfully edited."
            );
          }
        })
        .catch((e: AxiosError) => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "User data",
            "Unable to change the user info. Retry later or contact us if the problem persists."
          );
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
    },
    changePassword() {
      eventbus.$emit("startLoading", "Updating your account data");
      this.changePasswordForm.oldPassword = sha.hashText(this.changePasswordForm.oldPassword);
      this.changePasswordForm.newPassword = sha.hashText(this.changePasswordForm.newPassword);
      api
        .changePassword(this.changePasswordForm)
        .then((r: AxiosResponse): void => {
          if (r.status == 200) {
            this.$router.push({ name: "Home" });
            eventbus.$emit(
              "successMessage",
              "User data",
              "Password successfully changed."
            );
          }
        })
        .catch((e: AxiosError): void => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "User data",
            "Unable to change the user password. Retry later or contact us if the problem persists."
          );
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
    },
  },
});
</script>

<style lang="scss"></style>
