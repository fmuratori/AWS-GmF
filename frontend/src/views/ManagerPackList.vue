<template lang="pug">
b-container.mb-5
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      hr.shaded
      h4.text-center
        b PACK LIST
      hr.shaded
  b-row.justify-content-center.my-5
    b-col(lg='12' md='12' cols='12')
      b-row(v-if="this.$store.state.session.userData.type != 'user'")
        label Pack status
        FilterButtons(:filters='filters' :selected='0' @click='filterBy')
      b-row
        b-col(lg='8' md='8' sm='12')
          b-table(show-empty ref='packsTable' hover='hover' striped='striped' responsive='responsive' :fields='tableFields' :items='packList')
            template(#cell(status)='data')
              b-badge(v-if="data.value == 'ready'" variant='primary') {{ data.value }}
              b-badge(v-if="data.value == 'planned delivery'" variant='warning') {{ data.value }}
              b-badge(v-if="data.value == 'delivered'" variant='success') {{ data.value }}
            template(#cell(buttons)='{ item }')
              b-button-group
                b-button.color3(size='sm' @click='selectedPack = item;') Details
                b-button.color3(size='sm' @click='setDelivered(item._id)' :disabled="item.status != 'planned delivery'") Advance
                b-button.color3(size='sm' variant='danger' v-b-modal.modal @click='deletePackId = item._id') Delete
            template(#empty='scope')
              h4.text-center There are no records to show
            template(#emptyfiltered='scope')
              h4.text-center There are no records matching your request
        b-col(lg='4' md='4' sm='12')
          b-card(bg-variant='light')
            template(#header)
              h5.mb-0
                b Pack info
                span.float-right(v-if='selectedPack')
                  b-badge {{ selectedPack.pack.status }}
            div(v-if='selectedPack')
              h4 Family
              div
                b name:
                span {{ selectedPack.family.name }}
              div
                b components:
                span {{ selectedPack.family.components }}
              div
                b address:
                span {{ formatAddress(selectedPack.family.address) }}
              hr
              h4 Food list
              ul
                li(v-for='food in selectedPack.foodList')
                  | {{ selectedPack.pack.foodList.find(f =&gt; f.foodId == food._id).number }}x {{ food.name }}
              hr
              h4 QR code
              QrcodeVue.text-center.my-3(:value='selectedPack._id' size='200' level='H')
              b-button(variant='secondary' block='block' @click='selectedPack = null') Close pack info
            div(v-else)
              i No pack selected.     
  b-modal#modal(title='Delete this pack?' @ok='deletePack(deletePackId)')
    div This pack will be deleted permanently.
    template(#modal-footer='{ ok, cancel }')
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm    

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import dates from "../misc/dates";

import QrcodeVue from "qrcode.vue";
import FilterButtons from "../components/FilterButtons.vue";

import packApi from "../api/pack";
import { AxiosError, AxiosResponse } from "axios";

import { Address, Pack } from "../types/types";
import { ManagerPackListView } from "../types/viewTypes";

export default Vue.extend({
  name: "ManagerPackList",
  components: {
    FilterButtons,
    QrcodeVue,
  },
  data: (): ManagerPackListView => {
    return {
      filters: [
        { name: "all", label: "All", icon: null, isVisible: true },
        { name: "ready", label: "Ready", icon: null, isVisible: true },
        {
          name: "planned delivery",
          label: "Planned delivery",
          icon: null,
          isVisible: true,
        },
        { name: "delivered", label: "Delivered", icon: null, isVisible: true },
      ],
      packList: new Array<Pack>(),
      packListBackup: new Array<Pack>(),
      selectedPack: {} as Pack,
      tableFields: [
        {
          key: "pack.status",
          label: "Status",
          sortable: false,
        },
        {
          key: "pack.expirationDate",
          label: "Expiration Date",
          sortable: true,
          formatter: (date: Date) => {
            if (date) return dates.formatDate(date);
          },
        },
        {
          key: "pack.deliveryDate",
          label: "Delivery Date",
          sortable: true,
          formatter: (date: Date) => {
            if (date) return dates.formatDate(date);
          },
        },
        {
          key: "pack.deliveryPeriod",
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
    eventbus.$emit("startLoading", "Loading packs");
    packApi
      .packList({})
      .then((r: AxiosResponse): void => {
        this.packList = r.data as Pack[];
        this.packListBackup = this.packList;
      })
      .catch((e: AxiosError): void => console.log(e))
      .then(() => {
        eventbus.$emit("stopLoading");
        this.filterBy("all");
      });
  },
  methods: {
    filterBy(status: "ready" | "planned delivery" | "delivered" | "all"): void {
      if (status != "all") {
        this.packList = this.packListBackup.filter((p: Pack) => {
          p.status == status;
        });
        // if (newPacks) this.packList.push(newPacks)
      } else this.packList = this.packListBackup;
    },
    deletePack(id: string): void {
      packApi
        .deletePack({ id: id })
        .then((): void => {
          this.packList = this.packList.filter((e: Pack) => e._id != id);
          eventbus.$emit(
            "successMessage",
            "Pack",
            "Pack successfully deleted."
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Pack",
            "Unable to delete the pack. Retry later or contact us if the problem persists."
          );
        });
    },
    setDelivered(id: string) {
      eventbus.$emit("startLoading", "Setting pack as delivered");
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
        })
        .then(() => eventbus.$emit("stopLoading"));
    },
    formatAddress(addr: Address) {
      return addr.street + " " + addr.civicNumber + ", " + addr.city;
    },
  },
});
</script>

<style scoped lang="scss"></style>
