<template lang="pug">
b-container
  b-row.justify-content-md-center.no-gutters
    b-col.mb-5(lg=6, md=8, sm=10)
      .mb-4
        b-form(v-if="mode == 'password'" @submit.stop.prevent="changePassword")
          
          div.my-5
            hr.shaded
            h4.text-center
              b CHANGE PASSWORD
            hr.shaded

          InputText.mb-5(
            title="Old password:",
            placeholder="Insert your old password here",
            type="password",
            required,
            :text="changePasswordForm.oldPassword",
            v-on:data="(e) => { changePasswordForm.oldPassword = e; }"
          )

          InputPasswordSelect(
            title1="New password: ",
            title2="Confirm new password: ",
            placeholder1="Insert your password here",
            placeholder2="Repeat your password here",
            v-on:data="(e) => { changePasswordForm.newPassword = e; }"
          )

          b-button.color3(block, type="submit") Edit
          b-button(block, variant="secondary") Cancel

      b-form(v-if="mode == 'user_info'" @submit.stop.prevent="editUser")

        div.my-5
          hr.shaded
          h4.text-center
            b USER INFO
          hr.shaded

        InputText(
          title="Name: ",
          placeholder="Insert name here",
          required,
          :text="editUserForm.name",
          v-on:data="(e) => { editUserForm.name = e; }"
        )

        InputText(
          title="Surname: ",
          placeholder="Insert surname here",
          required,
          :text="editUserForm.surname",
          v-on:data="(e) => { editUserForm.surname = e; }"
        )
        
        InputText(
          title="Email: ",
          placeholder="Insert your email here",
          type="email",
          required,
          :text="editUserForm.email",
          v-on:data="(e) => { editUserForm.email = e; }"
        )

      
        InputText(
          title="Phone number: ",
          placeholder="Insert your phone number here",
          required,
          :text="editUserForm.phoneNumber",
          v-on:data="(e) => { editUserForm.phoneNumber = e; }"
        )

        b-button.color3(block, type="submit") Edit
        b-button(block, variant="secondary", @click="$router.go(-1)") Cancel
      
      b-form(v-if="mode == 'address'" @submit.stop.prevent="editUser")
        div.my-5
          hr.shaded
          h4.text-center
            b ADDRESS
          hr.shaded

        InputAddress(
          :city="editUserForm.address.city",
          :civic="editUserForm.address.civicNumber",
          :street="editUserForm.address.street",
          v-on:data="(e) => { editUserForm.address = e; }"
        )

        b-button.color3(block, type="submit") Edit
        b-button(block, variant="secondary", @click="$router.go(-1)") Cancel
  
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputPasswordSelect from "../components/input/InputPasswordSelect.vue";

import api from "../api/user";
import { Address, UserData, changePasswordPayload } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerEditUserInfo",
  components: {
    InputText,
    InputPasswordSelect,
    InputAddress,
  },
  data: () => {
    return {
      regRepeatPassword: "",
      editUserForm: {
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

    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      if (!("mode" in this.$route.params)) {
        this.$router.push({ name: "Home" });
      } else {
        this.mode = this.$route.params.mode;
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
      eventbus.$emit("startLoading", "Updating your account data");
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
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
    },
    changePassword() {
      eventbus.$emit("startLoading", "Updating your account data");
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
