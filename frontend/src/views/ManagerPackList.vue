<template lang="pug">
b-container
  .justify-content-center.my-5
    h3 
      b AVAILABLE PACKS

    b-row(v-if="this.$store.state.session.userData.type != 'user'")
      b-button-group(size="lg")
        b-button.btn-my(@click="changeView('my')") Only my
        b-button.btn-all(@click="changeView('all')") All

    b-row
      b-table(
        hover,
        striped,
        responsive,
        :fields="tableFields",
        :items="packList"
      )
        template(#cell(delete)="{ item }")
          b-button(variant="danger", @click="deletePack(item._id)") Delete
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import api from "../api";

import { Pack } from "../types";
import { PackManagerView } from "../viewTypes";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerPackList",
  components: {
    Navbar,
    Sidebar,
  },
  data: (): PackManagerView => {
    return {
      view: "all",
      packList: new Array<Pack>(),
      tableFields: [
        "status",
        "familyId",
        "deliveryDate",
        "deliveryPeriod",
        "delete",
      ],
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      // TODO: mostrare uno spinner mentre sono caricati i dati
      api
        .packList({})
        .then((r: AxiosResponse): void => {
          this.packList = r.data as Pack[];
        })
        .catch((e: AxiosError): void => console.log(e));
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    changeView(view: "my" | "all"): void {
      var payload = {};

      // if (view == "my") {
      //   payload = {
      //     filter: { reporterId: this.$store.state.session.userData._id },
      //   };
      // }
      this.view = view;

      api
        .packList(payload)
        .then((r: AxiosResponse): void => {
          this.packList = r.data as Pack[];
        })
        .catch((e: AxiosError): void => console.log(e));
    },
    deletePack(id: string): void {
      api
        .deletePack({ id: id })
        .then((): void => {
          this.packList = this.packList.filter((e) => e._id != id);
          this.$root.$bvToast.toast(`Food successfully created.`, {
            title: "Food",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((): void => {
          this.$root.$bvToast.toast(
            `Unable to add food. Retry later or contact us if the problem persist.`,
            {
              title: "Food",
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

<style scoped lang="scss"></style>
