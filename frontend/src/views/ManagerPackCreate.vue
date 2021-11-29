<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b CREATE A PACK
      hr.sidebar-hr.my-3

      div(v-if="step == 'selectFamily'")
        b-row
          b-col
            FamilyView(v-on:select="(family) => selectFamily(family)")

      div(v-if="step == 'selectFoods'")
        b-row
          b-col
            h4 About the family
            div
              b Name:
              span {{ selectedFamily.name }}
            div 
          div 
            div 
              b Components:
              span {{ selectedFamily.components }}
            div
              b Phone number:
              span {{ selectedFamily.phoneNumber }}
            div
              b Address:
              span {{ formatAddress(selectedFamily.address) }}

        hr.sidebar-hr.my-3

        b-form(@submit.stop.prevent="createPack")
          FoodView(
            selectableItems,
            v-on:data="(e) => { this.foodList = e; }"
          )

          b-row
            b-col
              b-button(
                block,
                variant="outline-danger",
                @click="$router.push({ name: 'ManagerFamilyList' })"
              ) Cancel
            b-col
              b-button(block, variant="success", type="submit") Create

      div(v-if="step == 'loading'")
        b-row
          b-col
            h3 Loading data
            p We are loading all the printable data...

    div(v-if="step == 'printableInfo'")
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b PACK INFO
      hr.sidebar-hr.my-3

      div
        h3 Pack # {{ form._id }}
        b-row
          b-col(cols="auto")
            QrcodeVue(
              value="{a: 'ASD', b: [{c:'asd'}]}",
              size="300",
              level="H"
            )
          b-col
            p {{ form }}

      b-card
        vue-html2pdf(
          :show-layout="true",
          :float-layout="false",
          :enable-download="false",
          :preview-modal="true",
          :paginate-elements-by-height="1400",
          :filename="'donation_' + form._id",
          :pdf-quality="2",
          :manual-pagination="false",
          pdf-format="a4",
          pdf-orientation="landscape",
          pdf-content-width="800px",
          ref="printableData"
        )
          section(slot="pdf-content")
            div
              h4.mb-0 Foods
              .mb-2(v-for="(food, idx) in form.foodList", :key="idx")
                p.mb-0 Name: {{ food.name }}
                p.mb-0 Quantity: {{ food.number }}
                p.mb-0 Expiration date: {{ food.expirationDate }}

        div
          b-button(v-if="!isPrinted", block, @click="print()") Print pack info
          b-button(
            v-if="isPrinted",
            block,
            variant="success",
            @click="print()"
          ) 
            b-icon(icon="check")
            span Pack info printed
          b-button(block, @click="$router.push({ name: 'ManagerFamilyList' })") Create another pack
          b-button(
            block,
            @click="$router.push({ name: 'ManagerPackDelivery' })"
          ) Reserve a pack

      vue-html2pdf(
        :show-layout="false",
        :float-layout="true",
        :enable-download="true",
        :preview-modal="false",
        :paginate-elements-by-height="1400",
        :filename="'donation_' + form._id",
        :pdf-quality="2",
        :manual-pagination="false",
        pdf-format="a5",
        pdf-orientation="landscape",
        pdf-content-width="800px",
        ref="printableData"
      )
        section(slot="pdf-content")
          .p-3
            h3 Pack # {{ form._id }}
            b-row
              b-col(cols="auto")
                QrcodeVue(
                  value="{a: 'ASD', b: [{c:'asd'}]}",
                  size="300",
                  level="H"
                )
              b-col
                p {{ form }}

        b-button(v-if="!isPrinted", block, @click="print()") Print pack info
        b-button(v-if="isPrinted", block, variant="success", @click="print()") 
          b-icon(icon="check")
          span Pack info printed
        b-button(block, @click="$router.push({ name: 'ManagerPackCreate' })") Create another pack
        b-button(block, @click="$router.push({ name: 'ManagerPackDelivery' })") Reserve a pack
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import QrcodeVue from "qrcode.vue";
import VueHtml2pdf from "vue-html2pdf";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FoodView from "../components/FoodView.vue";
import FamilyView from "../components/FamilyPicker.vue";
import eventbus from "../eventbus";

import { Family, SelectableFood, Pack, Address } from "../types";

import packApi from "../api/pack";
import { PackCreateView } from "../viewTypes";
import { AxiosResponse, AxiosError } from "axios";

export default Vue.extend({
  name: "ManagerPackCreate",
  components: {
    Navbar,
    Sidebar,
    FoodView,
    FamilyView,
    QrcodeVue,
    VueHtml2pdf,
  },
  data: (): PackCreateView => {
    return {
      step: "selectFamily",
      foodList: new Array<SelectableFood>(),
      familyList: new Array<Family>(),
      selectedFamily: null,
      form: {
        foodList: new Array<{ foodId: string; number: number }>(),
        familyId: "",
        expirationDate: null,
      } as Pack,
      isPrinted: false,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    formatAddress(addr: Address): string {
      return addr.street + " " + addr.civicNumber + ", " + addr.city;
    },
    selectFamily(family: Family): void {
      this.selectedFamily = family;
      this.step = "selectFoods";
    },

    print() {
      this.isPrinted = true;

      this.$refs.printableData.generatePdf();
    },
    createPack(): void {
      this.foodList.forEach((elem) => {
        if (elem.selected) {
          this.form.foodList.push({ foodId: elem._id, number: elem.selected });
        }
      });

      console.log(this.foodList);

      this.form.familyId = this.selectedFamily._id;
      this.form.expirationDate = moment(
        new Date(
          Math.max.apply(
            null,
            this.foodList
              .filter((f) => f.selected)
              .map((f) => new Date(f.expirationDate))
          )
        )
      ).format("YYYY-MM-DD");

      this.showScreen = "loading";
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
              .getPackInfo(r.data._id)
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
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
