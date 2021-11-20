<template lang="pug">
div
  b-button(block, variant="outline-primary", v-b-modal.updateUserModal) Update user

  b-modal#updateUserModal(
    title="Upgrade a user to volunteer role",
    @ok="upgradeUser",
    hide-footer
  )
    b-form(@submit.stop.prevent="upgradeUser")
      InputText(
        type="email",
        placeholder="Digit user's email here",
        required,
        v-on:data="(e) => { userEmail = e; }"
      )

      b-button-group.d-flex
        b-button(variant="danger", @click="$bvModal.hide('updateUserModal')") Cancel
        b-button(variant="primary", type="submit") Upgrade
</template>

<script lang="ts">
import Vue from "vue";
import InputText from "../input/InputText.vue";

import api from "../../api/user";

export default Vue.extend({
  name: "UserUpgradeModal",
  components: {
    InputText,
  },
  data: function () {
    return {
      userEmail: "",
    };
  },
  methods: {
    upgradeUser(e) {
      e.preventDefault();

      api
        .upgradeUser({ email: this.userEmail })
        .then(() => {
          this.$root.$bvToast.toast(`User successfully upgraded.`, {
            title: "User",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
          this.$nextTick(() => {
            this.$bvModal.hide("updateUserModal");
          });
        })
        .catch(() => {
          this.$root.$bvToast.toast(
            `Unable to upgrade user. Retry later or contact us if the problem persist.`,
            {
              title: "User",
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

<style scoped lang="scss">
</style>
