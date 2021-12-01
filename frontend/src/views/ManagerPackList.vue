<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b AVAILABLE PACKS
      hr.sidebar-hr.my-3

      b-row(v-if="this.$store.state.session.userData.type != 'user'")
        FilterButtons(
          label="Pack status",
          :filters="['all', 'ready', 'planned delivery', 'delivered']",
          v-on:click="(filter) => filterBy(filter)"
        )

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

            template(#cell(buttons)="{ item }")
              b-button-group
                b-button(size="sm", @click="showDetails(item)") Details
                b-button(
                  size="sm",
                  variant="primary",
                  @click="setDelivered(item._id)",
                  :disabled="item.status != 'planned delivery'"
                ) Advance
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
import moment from "moment";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FilterButtons from "../components/FilterButtons.vue";

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
    FilterButtons,
  },
  data: (): PackManagerView => {
    return {
      statusFilter: "all",
      packList: new Array<Pack>(),
      packListBackup: new Array<Pack>(),
      familyDetails: undefined,
      foodDetails: undefined,
      tableFields: [
        {
          key: "status",
          label: "Status",
          sortable: false,
        },
        {
          key: "expirationDate",
          label: "Expiration Date",
          sortable: true,
          formatter: (date: Date) => {
            if (date) return moment(date).locale("en").format("LL");
          },
        },
        {
          key: "deliveryDate",
          label: "Delivery Date",
          sortable: true,
          formatter: (date: Date) => {
            if (date) return moment(date).locale("en").format("LL");
          },
        },
        {
          key: "deliveryPeriod",
          label: "Delivery Period",
          sortable: false,
        },
        {
          key: "buttons",
          label: "",
          sortable: false,
        },
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
          this.packListBackup = r.data as Pack[];
          this.packList = this.packListBackup;
        })
        .catch((e: AxiosError): void => console.log(e));
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    filterBy(status: "ready" | "planned delivery" | "delivered" | "all"): void {
      if (this.statusFilter == status) return;

      this.statusFilter = status;
      if (status != "all") {
        this.packList = this.packListBackup.filter((p: Pack) => {
          p.status == status;
        });
      } else this.packList = this.packListBackup;
    },
    deletePack(id: string): void {
      packApi
        .deletePack({ id: id })
        .then((): void => {
          this.packList = this.packList.filter((e) => e._id != id);
          eventbus.$emit(
            "successMessage",
            "Foods",
            "Food successfully deleted."
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Foods",
            "Unable to delete the pack. Retry later or contact us if the problem persists."
          );
        });
    },
    setDelivered(id: string) {
      packApi
        .setDelivered({ id: id })
        .then((): void => {
          this.packList.forEach((elem) => {
            if (elem._id == id) {
              elem.status = "delivered";
              console.log(elem);
            }
          });
          eventbus.$emit(
            "successMessage",
            "Foods",
            "Pack state changed to delivered succesfully."
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Foods",
            "Unable to upgrade pack status. Retry later or contact us if the problem persists."
          );
        });
    },
    showDetails(pack: Pack) {
      familyApi
        .familyList({ filter: { _id: pack.familyId } })
        .then((r: AxiosResponse) => {
          this.familyDetails = (r.data as Family)[0];
        })
        .catch(() => {
          console.log("TODO");
        });

      const foodMap = new Map();
      pack.foodList.forEach((elem) => {
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
