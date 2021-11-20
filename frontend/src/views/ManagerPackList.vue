<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b AVAILABLE PACKS
      hr.sidebar-hr.my-3

      b-row(v-if="this.$store.state.session.userData.type != 'user'")
        b-button-group(size="lg")
          b-button.btn-my(@click="changeView('my')") Only my
          b-button.btn-all(@click="changeView('all')") All

      hr.sidebar-hr.my-3

      b-row
        b-col(lg="8", md="8", sm="12")
          b-table(
            hover,
            striped,
            responsive,
            :fields="tableFields",
            :items="packList"
          )
            template(#cell(status)="data")
              b-badge(v-if="data.value == 'ready'", variant="primary") {{ data.value }}
              b-badge(
                v-if="data.value == 'planned delivery'",
                variant="warning"
              ) {{ data.value }}
              b-badge(v-if="data.value == 'delivered'", variant="success") {{ data.value }}

            template(#cell(details)="row")
              b-button(size="sm", @click="showDetails(row)") Show details

            template(#cell(advance)="{ item }")
              b-button(
                size="sm",
                variant="primary",
                @click="advancePackStatus(item._id)",
                :disabled="item.status != 'planned delivery'"
              ) Advance

            template(#cell(delete)="{ item }")
              b-button(
                size="sm",
                variant="danger",
                v-b-modal.modal,
                @click="deletePackId = item._id"
              ) Delete

          b-modal#modal(title="Confirm?", @ok="deletePack(deletePackId)")
            div Confirm to delete pack
            template(#modal-cancel) Cancel
            template(#modal-ok) Confirm

        b-col(lg="4", md="4", sm="12")
          b-card
            b-row(v-model="familyDetails")
              b-col(v-if="familyDetails != undefined")
                h4 Family
                div
                  b name:
                  span {{ this.familyDetails.name }}
                div 
                  b components:
                  span {{ this.familyDetails.components }}
                div
                  b address:
                  span {{ formatAddress(this.familyDetails.address) }}
            hr.sidebar-hr.my-3
            b-row(v-model="foodDetails")
              b-col(v-if="foodDetails != undefined")
                h4 Food list
                div(v-for="food in foodDetails") {{ food.number }}x {{ food.name }}
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import packApi from "../api/pack";
import familyApi from "../api/family";
import foodApi from "../api/food";

import { Address, Family, Food, Pack } from "../types";
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
      familyDetails: undefined,
      foodDetails: undefined,
      tableFields: [
        "status",
        "deliveryDate",
        "deliveryPeriod",
        "details",
        "delete",
        "advance",
      ],
      deletePackId: "",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // TODO: mostrare uno spinner mentre sono caricati i dati
      packApi
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

      packApi
        .packList(payload)
        .then((r: AxiosResponse): void => {
          this.packList = r.data as Pack[];
        })
        .catch((e: AxiosError): void => console.log(e));
    },
    deletePack(id: string): void {
      packApi
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
    advancePackStatus(id: string) {
      packApi
        .advancePackStatus({ id: id })
        .then((): void => {
          this.packList.forEach((elem) => {
            if (elem._id == id) {
              elem.status = "delivered"
              console.log(elem)
              };
          });
          this.$root.$bvToast.toast(`Food successfully created.`, {
            title: "Food",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((): void => {
          this.$root.$bvToast.toast(
            `Unable to upgrade pack status. Retry later or contact us if the problem persist.`,
            {
              title: "Pack",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
    showDetails(row: any) {
      familyApi
        .familyList({ filter: { _id: row.item.familyId } })
        .then((r: AxiosResponse) => {
          this.familyDetails = (r.data as Family)[0];
        })
        .catch(() => {
          console.log("TODO");
        });

      const foodMap = new Map();
      row.item.foodList.forEach((elem) => {
        foodMap.set(elem.foodId, elem.number);
      });
      const foodIdList = Array.from(foodMap.keys());
      foodApi
        .foodList({ filter: { _id: foodIdList } })
        .then((r: AxiosResponse) => {
          this.foodDetails = r.data as Food[];
          this.foodDetails.forEach((elem) => {
            elem.number = foodMap.get(elem._id);
          });
        })
        .catch(() => {
          console.log("TODO");
        });
    },
    formatAddress(addr: Address) {
      return addr.street + " " + addr.civicNumber + ", " + addr.city;
    },
  },
});
</script>

<style scoped lang="scss"></style>
