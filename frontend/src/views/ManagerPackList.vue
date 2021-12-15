<template lang="pug">
b-container.mb-5
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      hr.shaded
      h4.text-center
        b PACK LIST
      hr.shaded
  b-row
    b-col(lg='8' md='12' sm='12')
      b-row.justify-content-center(:align-h='$store.getters.isMediumScreenWidth ? null : "between"')
        b-col(lg='6' md='8' cols='12')
          b-form-group
            b-input-group
              b-form-input(v-model='filter' type='search' placeholder='Type to search' size='sm')
              b-input-group-append
                b-button(:disabled='!filter' @click="filter = ''" size='sm') Clear
        b-col(md='auto' cols='12')
          b-pagination(v-model='currentPage' :total-rows='totalRows' :per-page='perPage' align='fill' size='sm')  
        b-col(md='auto' cols='12')
          b-table(show-empty ref='packsTable' hover='hover' striped='striped' responsive='responsive' :fields='tableFields' :items='packList' :current-page='currentPage' :per-page='perPage' :filter='filter' :filter-included-fields='filterOn' :sort-by.sync='sortBy' :sort-desc.sync='sortDesc' :sort-direction='sortDirection' @filtered='onFiltered')
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
    b-col(lg='4' md='12' sm='12')
      b-card(bg-variant='light' no-body='no-body')
        b-card-text
          b-card-header
            b Pack info
            span.float-right(v-if='"_id" in selectedPack')
              b-badge {{ selectedPack.pack.status }}
          .px-4.pt-4
            div(v-if='"_id" in selectedPack')
              h4 Family
              div
                b Name:&nbsp;
                span {{ selectedPack.family.name }}
              div
                b Components:&nbsp;
                span {{ selectedPack.family.components }}
              div
                b Address:&nbsp;
                span {{ formatAddress(selectedPack.family.address) }}
              hr
              h4 Food list
              ul
                li(v-for='food in selectedPack.foodList')
                  | {{ selectedPack.pack.foodList.find(f =&gt; f.foodId == food._id).number }}x {{ food.name }}
              hr
              h4 QR code
              QrcodeVue.text-center.my-3(:value='selectedPack._id' size='200' level='H')
            div(v-else).mb-4
              i No pack selected.    
          b-button.footerCardButton(variant='secondary' block='block' v-if='"_id" in selectedPack' @click='selectedPack = {}') CLOSE
  
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
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      filter: "",
      filterOn: [
        "pack.status",
        "pack.expirationDate",
        "pack.deliveryDate",
        "pack.deliveryPeriod",
      ],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      tableFields: [
        {
          key: "pack.status",
          label: "Status",
          sortable: true,
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
          sortable: true,
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
    onFiltered(filteredItems: Pack[]) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
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
