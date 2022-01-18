<template lang="pug">
b-container.mb-5
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      hr.shaded
      h4.text-center
        b CREATE A PACK
      hr.shaded
  div(v-if="step == 'selectFamily'")
    FamilyView(@select='(family) => selectFamily(family)')

  b-row.justify-content-center.my-5(v-if="step == 'selectFoods'")
    b-col(cols='12' md='12' lg='12')
      FoodView(selectableItems removeExpired @data='updateFoodList')
      b-row.mb-3
        b-col
          b-card(bg-variant='light' text-variant='dark' no-body)
            b-card-text
              b-card-header 
                b Family info
              .p-4
                div
                  b Name:&nbsp;
                  span {{ selectedFamily.name }}
                div
                  b Components:&nbsp;
                  span {{ selectedFamily.components }}
                div
                  b Phone number:&nbsp;
                  span {{ selectedFamily.phoneNumber }}
                div
                  b Address:&nbsp;
                  span {{ formatAddress(selectedFamily.address) }}
        b-col
          b-card(bg-variant='light' text-variant='dark' no-body)
            b-card-text
              b-card-header 
                b Pack
              .p-4
                div(v-if='foodList.length > 0')
                  div(v-for='(food, idx) in foodList' :key='idx')
                    div
                      b Name:&nbsp;
                      span {{ food.name }}
                    div
                      b Labels:&nbsp;
                      b-badge.mr-1(variant='success' v-for='label in food.labels' size='sm') {{ label }}
                    div
                      b Expiration date:&nbsp;
                      span {{ dates.formatDate(food.expirationDate) }}
                    div
                      b Amount:&nbsp;
                      span {{ food.selected }} / {{ food.number}} 
                    hr
                  div
                    b Expiration date:&nbsp;
                    span {{ dates.formatDate(form.expirationDate) }}
                .text-center(v-if='foodList.length == 0')
                  i No food selected for this family.
      b-form(@submit.stop.prevent='createPack')
        b-row
          b-col
            b-button(block variant='secondary' @click='resetView()') Cancel
          b-col
            b-button.color3(block type='submit') Create
  b-row.justify-content-center.my-5(v-if="step == 'printableInfo'")
    b-col(cols='11' md='11' lg='6')
      div
        b-alert.mb-5(variant='success' show='show')
          b-row(align-v='center')
            b-col.text-center(cols='3')
              Icon(bootstrap icon='check' font-scale='4')
            b-col(cols='auto')
              p.mb-0 Pack successfully created.
        b-card(bg-variant='light')
          h3 Pack # {{ form._id }}
          b-row.justify-contect-center(align-h='center')
            b-col.text-center(cols='12')
              QrcodeVue.my-3(:value='form._id' size='300' level='H')
            b-col.mb-3(cols='11' md='6')
              h4.mb-2 Family info
              div
                b Name:&nbsp;
                span {{ selectedFamily.name }}
              div
                b Components:&nbsp;
                span {{ selectedFamily.components }}
              div
                b Phone number:&nbsp;
                span {{ selectedFamily.phoneNumber }}
              div
                b Address:&nbsp;
                span {{ formatAddress(selectedFamily.address) }}
            b-col(cols='11' md='6')
              h4.mb-2 Foods
              ul.mb-1.pl-4(v-if='form.foodList.length > 0')
                li.ml-0.pl-0(v-for='(food, idx) in foodList' :key='idx')
                  span {{ food.name }} x{{ food.selected }} 
              div
                b Pack expiration date:&nbsp;
                span {{ dates.formatDate(form.expirationDate) }}
        .mt-3
          b-button.color3(v-if='!isPrinted' block @click='saveAsPdf()')
            b-icon.mr-2(icon='printer')
            span Print pack info
          b-button(v-if='isPrinted' block variant='success' @click='saveAsPdf()')
            span Pack info printed
            Icon(bootstrap icon='check')
          b-button(block @click='resetView') Create another pack
          b-button(block @click="$router.push({ name: 'ManagerPackDelivery' })") Reserve a pack
      vue-html2pdf(:show-layout='false' :float-layout='true' :enable-download='true' :preview-modal='false' :paginate-elements-by-height='1400' :filename="'donation_' + form._id" :pdf-quality='2' :manual-pagination='false' pdf-format='a5' pdf-orientation='landscape' pdf-content-width='800px' ref='printableData')
        section(slot='pdf-content')
          h3.px-4.pt-4.pb-2 Pack # {{ form._id }}
          b-row.justify-contect-center.no-gutters(align-v='center')
            b-col.px-4(cols='auto')
              QrcodeVue.my-3(:value='form._id' size='300' level='H')
            b-col(cols='6')
              .mb-3
                h4 Family info
                div
                  b Name:&nbsp;
                  span {{ selectedFamily.name }}
                div
                  b Components:&nbsp;
                  span {{ selectedFamily.components }}
                div
                  b Phone number:&nbsp;
                  span {{ selectedFamily.phoneNumber }}
                div
                  b Address:&nbsp;
                  span {{ formatAddress(selectedFamily.address) }}
              div
                h4 Foods
                div(v-if='form.foodList.length > 0')
                  div(v-for='(food, idx) in foodList' :key='idx')
                    label {{ food.name }} x {{ food.selected }} 
                  hr
                  div
                    b Pack expiration date:&nbsp;
                    span {{ dates.formatDate(form.expirationDate) }}
</template>

<script lang="ts">
import Vue from "vue";
import dates from "../misc/dates";
import eventbus from "../eventbus";

import QrcodeVue from "qrcode.vue";
import VueHtml2pdf from "vue-html2pdf";
import FoodView from "../components/FoodView.vue";
import FamilyView from "../components/FamilyView.vue";
import Icon from "../components/Icon.vue";

import { ManagerPackCreateView } from "../types/viewTypes";
import {
  Family,
  SelectableFood,
  Pack,
  Address,
  PackPayload,
} from "../types/types";

import packApi from "../api/pack";
import { AxiosResponse, AxiosError } from "axios";

export default Vue.extend({
  name: "ManagerPackCreate",
  components: {
    FoodView,
    FamilyView,
    QrcodeVue,
    VueHtml2pdf,
    Icon,
  },
  data: (): ManagerPackCreateView => {
    return {
      step: "selectFamily",
      foodList: new Array<SelectableFood>(),
      selectedFamily: {} as Family,
      form: {
        foodList: new Array<{ foodId: string; number: number }>(),
        familyId: "",
        expirationDate: new Date(),
      } as PackPayload,
      isPrinted: false,
    };
  },
  computed: {},
  methods: {
    updateFoodList(foods: SelectableFood[]) {
      this.foodList = foods;
      this.form.expirationDate = dates.getNearestDate(
        this.foodList.map((f: SelectableFood) => f.expirationDate)
      );
    },
    formatAddress(addr: Address): string {
      return addr.street + " " + addr.civicNumber + ", " + addr.city;
    },
    selectFamily(family: Family): void {
      this.selectedFamily = family;
      this.step = "selectFoods";
    },

    saveAsPdf() {
      this.isPrinted = true;
      this.$refs.printableData.generatePdf();
    },
    createPack(): void {
      this.foodList.forEach((elem: { selected: boolean; _id: string }) => {
        if (elem.selected) {
          this.form.foodList.push({ foodId: elem._id, number: elem.selected });
        }
      });
      if (!this.form.foodList.length) {
        eventbus.$emit(
          "warningMessage",
          "Pack creation",
          "Select at least one food to add in the pack."
        );
        return;
      }
      if (this.selectedFamily) this.form.familyId = this.selectedFamily._id;
      eventbus.$emit("startLoading", "Creating a new food pack");

      packApi
        .createPack(this.form)
        .then((r: AxiosResponse<Pack>): void => {
          if (r.status == 200) {
            this.step = "loading";
            eventbus.$emit(
              "successMessage",
              "Food packs",
              "Pack successfully created."
            );

            packApi
              .packListExpanded({ _id: r.data._id })
              .then((r2: AxiosResponse<Pack>): void => {
                if (r2.status == 200) {
                  this.form = r2.data;
                  this.step = "printableInfo";
                }
              })
              .catch((e2: AxiosError): void => {
                console.log(e2);
                eventbus.$emit(
                  "errorMessage",
                  "Food packs",
                  "Unable to find the specified pack. Retry later or contact us if the problem persists."
                );
              });
          }
        })
        .catch((e: AxiosError): void => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "Food packs",
            "Unable to create a food pack. Retry later or contact us if the problem persists."
          );
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
    },
    resetView() {
      this.step = "selectFamily";
      this.selectedFamily = {} as Family;
      this.isPrinted = false;
      this.foodList = [];
      this.form = {
        foodList: new Array<{ foodId: string; number: number }>(),
        familyId: "",
        expirationDate: new Date(),
      } as PackPayload;
    },
  },
});
</script>

<style scoped lang="scss"></style>
