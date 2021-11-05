<template lang="pug">
b-row.justify-content-md-center.my-5.no-gutters
  b-col(md="auto", xs=12)
    p CHANGE PASSWORD
    b-form(@submit="changePassword")
      .mb-3
        b-card
          b-form-group#input-group-1(
            label="Old password:",
            label-for="input-8"
          )
            b-form-input#input-1(
              type="password",
              v-model="changePasswordForm.oldPassword",
              placeholder="Type you're old password here",
              required
            )

          b-form-group#input-group-2(
            label="New password:",
            label-for="input-8",
            description="Scegli una password efficace, comporta da almeno 8 caratteri tra numeri e lettere maiuscole e minuscole."
          )
            b-form-input#input-2(
              type="password",
              v-model="changePasswordForm.newPassword",
              placeholder="Insert you're new password here",
              required
            )

          b-form-group#input-group-3(
            label="Repeat password:",
            label-for="input-9"
          )
            b-form-input#input-3(
              type="password",
              v-model="regRepeatPassword",
              placeholder="Confirm password",
              required,
              :state="registrationPasswordCheck()"
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
              b-form-group#input-group-4(label="Nome:", label-for="input-1")
                b-form-input#input-4(
                  type="text",
                  v-model="editUserForm.name",
                  placeholder="Type you're name here",
                  required
                )
            b-col
              b-form-group#input-group-5(label="Cognome:", label-for="input-2")
                b-form-input#input-5(
                  type="text",
                  v-model="editUserForm.surname",
                  placeholder="Type you're surname here",
                  required
                )

          b-row
            b-col
              b-form-group#input-group-6(label="E-Mail", label-for="input-11")
                b-input-group
                  b-input-group-prepend
                    b-input-group-text
                      b-icon(icon="at")
                  b-form-input#input-6(
                    type="text",
                    placeholder="Type you're email here",
                    required,
                    v-model="editUserForm.email"
                  )

          b-row
            b-col
              b-form-group#input-group-7(
                label="Phone number:",
                label-for="input-4"
              )
                b-form-input#input-7(
                  type="text",
                  v-model="editUserForm.phoneNumber",
                  required
                )

          hr

          b-row
            b-col
              b-form-group#input-group-8(label="City:", label-for="input-4")
                b-form-input#input-8(
                  required,
                  type="text",
                  v-model="editUserForm.address.city"
                )
          b-row
            b-col(cols=8)
              b-form-group#input-group-9(label="Address:", label-for="input-5")
                b-form-input#input-9(
                  required,
                  type="text",
                  v-model="editUserForm.address.street"
                )
            b-col(cols=4)
              b-form-group#input-group-10(
                label="Civic number:",
                label-for="input-10"
              )
                b-form-input#input-10(
                  required,
                  type="text",
                  v-model="editUserForm.address.civicNumber"
                )
          .text-center
            b-button(variant="outline-secondary") Find on maps

      b-row
        b-col
          b-button(block, variant="outline-danger", @click="cancel") Cancel
        b-col
          b-button(block, variant="success", type="submit") Edit
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosError } from "axios";

// import bcrypt from "bcrypt"

import api from "../api";
import { Address, editUserPayload, changePasswordPayload } from "../types";

export default Vue.extend({
  name: "ManagerEditUser",
  data: function () {
    return {
      regRepeatPassword: "Password2021!!",
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
        oldPassword: "Password2021!",
        newPassword: "Password2021!!",
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
        .then((r) => {
          this.$router.replace({ name: "Home" });
          this.$bvToast.toast(`Account information successfully edited.`, {
            title: "User info",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
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
