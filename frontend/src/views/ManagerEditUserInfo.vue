<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(cols="6")
      .mb-4
        h4
          b CHANGE PASSWORD

      .mb-4
        b-form(@submit="changePassword")
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

  b-row.justify-content-md-center.my-5.no-gutters
    b-col(cols="6")
      .mb-4
        h4
          b EDIT USER INFO

      b-form(@submit="editUser")
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

        hr

        .mb-4
          InputAddress(
            title="Location",
            :city="editUserForm.address.city",
            :street="editUserForm.address.street",
            :civic="editUserForm.address.civicNumber",
            v-on:city="(e) => { editUserForm.address.city = e; }",
            v-on:street="(e) => { editUserForm.address.street = e; }",
            v-on:civic="(e) => { editUserForm.address.civicNumber = e; }"
          )

      b-row
        b-col
          b-button(
            block,
            variant="outline-danger",
            @click="$router.replace({ name: 'ManagerHome' })"
          ) Cancel
        b-col
          b-button(block, variant="success", type="submit") Edit
</template>

<script lang="ts">
import Vue from "vue";
import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputPasswordSelect from "../components/input/InputPasswordSelect.vue";

// import bcrypt from "bcrypt"

import userApi from "../api/user";
import { Address, editUserPayload, changePasswordPayload } from "../types";

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
      // this.editUserForm = this.$store.state.session.userData;
      this.editUserForm.name = this.$store.state.session.userData.name;
      this.editUserForm.surname = this.$store.state.session.userData.surname;
      this.editUserForm.email = this.$store.state.session.userData.email;
      this.editUserForm.phoneNumber =
        this.$store.state.session.userData.phoneNumber;
      this.editUserForm.address = this.$store.state.session.userData.address;
      this.editUserForm.id = this.$store.state.session.userData._id;

      this.changePasswordForm.id = this.$store.state.session.userData._id;
    } else this.$router.replace({ name: "Login" });
  },
  methods: {
    registrationPasswordCheck() {
      return (
        this.changePasswordForm.newPassword == this.regRepeatPassword &&
        this.changePasswordForm.newPassword != ""
      );
    },
    editUser(event) {
      event.preventDefault();
      userApi
        .editUser(this.editUserForm)
        .then((r: any) => {
          if (r.status == 200) {
            (this.$store.state.session.userData = r.data.data.user),
              this.$router.replace({ name: "Home" });
            this.$bvToast.toast(`Account information successfully edited.`, {
              title: "User info",
              autoHideDelay: 5000,
              variant: "success",
              appendToast: false,
            });
          }
        })
        .catch((e) => {
          this.$bvToast.toast(
            `Unable to change the user info. Contact us if the problem persists.`,
            {
              title: "User info",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
    changePassword(event) {
      event.preventDefault();
      userApi
        .changePassword(this.changePasswordForm)
        .then((r) => {
          this.$router.replace({ name: "Home" });
          this.$bvToast.toast(`Password successfully changed.`, {
            title: "Password change",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          this.$bvToast.toast(
            `Unable to change the user password. Contact us if the problem persists.`,
            {
              title: "Password change",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
  },
});
</script>

<style lang="scss">
</style>
