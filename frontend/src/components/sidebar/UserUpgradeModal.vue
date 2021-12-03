<template lang="pug">
div
  b-nav-item.my-auto.navbar-link.text-center(href='#' v-b-modal.updateusermodal='v-b-modal.updateUserModal') Upgrade a user
  b-modal#updateUserModal(title='Upgrade a user to volunteer role' @ok='upgradeUser' hide-footer='hide-footer')
    b-form(@submit.stop.prevent='upgradeUser')
      InputText(type='email' placeholder="Digit user's email here" required='required' @data='(e) => { userEmail = e; }')
      b-button-group.d-flex
        b-button(variant='danger' @click="$bvModal.hide('updateUserModal')") Cancel
        b-button(variant='primary' type='submit') Upgrade
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../../eventbus";

import InputText from "../input/InputText.vue";

import api from "../../api/user";

export default Vue.extend({
  name: "UserUpgradeModal",
  components: {
    InputText,
  },
  data: () => {
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
          eventbus.$emit(
            "successMessage",
            "User",
            "User upgraded successfully."
          );
          this.$nextTick(() => {
            this.$bvModal.hide("updateUserModal");
          });
        })
        .catch(() => {
          eventbus.$emit(
            "errorMessage",
            "User",
            "Unable to upgrade user. Retry later or contact us if the problem persist."
          );
        });
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.navbar-link > * {
  color: $greyscaleE !important;
}
</style>
