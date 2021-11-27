<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg=6, md=10, sm=12)
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b CHANGE PASSWORD
      hr.sidebar-hr.my-3

      .mb-4
        b-form(@submit.stop.prevent="changePassword")
          InputText(
            title="Old password:",
            placeholder="Insert your old password here",
            type="password",
            required,
            :text="changePasswordForm.oldPassword",
            v-on:data="(e) => { changePasswordForm.oldPassword = e; }"
          )

        .mb-4
          InputPasswordSelect(
            title1="New password: ",
            title2="Confirm password: ",
            placeholder1="Insert your password here",
            placeholder2="Repeat your password here",
            v-on:data="(e) => { changePasswordForm.newPassword = e; }"
          )

        b-row
          b-col
            b-button(block, variant="success", type="submit") Edit

      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b EDIT USER INFO
      hr.sidebar-hr.my-3

      b-form(@submit.stop.prevent="editUser")
        .mb-4
          b-row
            b-col
              InputText(
                title="Name: ",
                placeholder="Insert name here",
                required,
                :text="editUserForm.name",
                v-on:data="(e) => { editUserForm.name = e; }"
              )

            b-col
              InputText(
                title="Surname: ",
                placeholder="Insert surname here",
                required,
                :text="editUserForm.surname",
                v-on:data="(e) => { editUserForm.surname = e; }"
              )

        .mb-4
          InputText(
            title="Email: ",
            placeholder="Insert your email here",
            type="email",
            required,
            :text="editUserForm.email",
            v-on:data="(e) => { editUserForm.email = e; }"
          )

        .mb-4
          InputText(
            title="Phone number: ",
            placeholder="Insert your phone number here",
            required,
            :text="editUserForm.phoneNumber",
            v-on:data="(e) => { editUserForm.phoneNumber = e; }"
          )

        .mb-4
          InputAddress(
            title="Location",
            :city="editUserForm.address.city",
            :civic="editUserForm.address.civicNumber",
            :street="editUserForm.address.street",
            v-on:data="(e) => { editUserForm.address = e; }"
          )

      b-row
        b-col
          b-button(block, variant="outline-danger", @click="$router.go(-1)") Cancel
        b-col
          b-button(block, variant="success", type="submit") Edit
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputPasswordSelect from "../components/input/InputPasswordSelect.vue";

import api from "../api/user";
import { Address, editUserPayload, changePasswordPayload } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerEditUserInfo",
  components: {
    InputText,
    InputPasswordSelect,
    InputAddress,
  },
  data: function () {
    return {
      regRepeatPassword: "",
      editUserForm: {
        id: "",
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
      } as editUserPayload,
      changePasswordForm: {
        id: "",
        oldPassword: "",
        newPassword: "",
      } as changePasswordPayload,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      this.editUserForm = this.$store.state.session.userData;
      this.changePasswordForm.id = this.$store.state.session.userData._id;
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    registrationPasswordCheck() {
      return (
        this.changePasswordForm.newPassword == this.regRepeatPassword &&
        this.changePasswordForm.newPassword != ""
      );
    },
    editUser() {
      api
        .editUser(this.editUserForm)
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
        });
    },
    changePassword() {
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
        });
    },
  },
});
</script>

<style lang="scss"></style>
