<template lang="pug">
b-row.justify-content-md-center.my-5.no-gutters
  b-col(md="auto", xs=12)
    p CHANGE PASSWORD
    b-form(@submit="changePassword")
      .mb-3
        b-card
          InputText(
            placeholder="Old password",
            type="password",
            required,
            :text="changePasswordForm.oldPassword",
            v-on:data="(e) => { changePasswordForm.oldPassword = e; }"
          )

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

    p EDIT USER INFO
    b-form(@submit="editUser")
      .mb-3
        b-card
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

          b-row
            b-col
              InputText(
                title="Email: ",
                placeholder="Insert your email here",
                type="email",
                required,
                :text="editUserForm.email",
                v-on:data="(e) => { editUserForm.email = e; }"
              )

          b-row
            b-col
              InputText(
                title="Phone number: ",
                placeholder="Insert your phone number here",
                required,
                :text="editUserForm.phoneNumber",
                v-on:data="(e) => { editUserForm.phoneNumber = e; }"
              )

          hr

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

import api from "../api";
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
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // this.editUserForm = this.$store.state.session.userData;
      this.editUserForm.name = this.$store.state.session.userData.name;
      this.editUserForm.surname = this.$store.state.session.userData.surname;
      this.editUserForm.email = this.$store.state.session.userData.email;
      this.editUserForm.phoneNumber =
        this.$store.state.session.userData.phoneNumber;
      this.editUserForm.address = this.$store.state.session.userData.address;
      this.editUserForm.id = this.$store.state.session.userData._id;

      this.changePasswordForm.id = this.$store.state.session.userData._id;
    }
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
      api
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
      api
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
  border-radius: 0;
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
