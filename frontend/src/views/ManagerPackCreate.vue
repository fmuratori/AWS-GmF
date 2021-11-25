<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters(v-if="showScreen=='pack'")
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b CREATE A PACK
      hr.sidebar-hr.my-3

      b-row
        b-col
          h4 About the family
          div
            b Name:
            span {{ family.name }}
          div 
            b Components:
            span {{ family.components }}
          div
            b Phone number:
            span {{ family.phoneNumber }}
          div
            b Address:
            span {{ family.address.street }} {{ family.address.civicNumber }} - {{ family.address.city }}

      hr.sidebar-hr.my-3

      b-form(@submit.stop.prevent="createPack")
        FoodView(selectableItems, v-on:data="(e) => { this.foodList = e; }")

        b-row
          b-col
            b-button(
              block,
              variant="outline-danger",
              @click="$router.push({ name: 'ManagerFamilies' })"
            ) Cancel
          b-col
            b-button(block, variant="success", type="submit") Create
  b-row(v-if="showScreen=='loading'")
    b-col()
      h3 Loading data
      p We are loading all the printable data...
  b-row.justify-content-md-center.my-5.no-gutters(v-if="showScreen=='printable_info'")
    b-col(lg=8, md=10, sm=12)
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b PACK INFO
      hr.sidebar-hr.my-3
      
      div
        h3 Pack # {{ form._id }}
        b-row().no-gutters
          b-col.mx-3(cols="auto") 
            QrcodeVue(:value="form._id" size="200" level="L").my-3
          b-col
            p {{ form }}

      
      b-card()
        vue-html2pdf(
        :show-layout="true"
        :float-layout="false"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        :filename="'donation_'+form._id"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a5"
        pdf-orientation="landscape"
        pdf-content-width="800px"
        ref="printableData")

          section(slot="pdf-content")
            div.p-3
              h3 Pack # {{ form._id }}
              b-row().no-gutters
                b-col.mx-3(cols="auto") 
                  QrcodeVue(:value="form._id" size="200" level="L").my-3
                b-col
                  p {{ form }}

        b-button(v-if="!isPrinted" block @click="print()") Print pack info
        b-button(v-if="isPrinted" block variant="success" @click="print()") 
          b-icon(icon="check")
          span Pack info printed
        b-button(block @click="$router.push({ name: 'ManagerFamilyList' });") Create another pack
        b-button(block @click="$router.push({ name: 'ManagerPackDelivery' });") Reserve a pack


</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import { AxiosResponse, AxiosError } from "axios";
import moment from "moment";
import QrcodeVue from "qrcode.vue"
import VueHtml2pdf from "vue-html2pdf"

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FoodView from "../components/FoodView.vue";

import { Family, PackPayload, SelectableFood, Pack } from "../types";

import api from "../api/pack";
import { PackCreateView } from "../viewTypes";

export default Vue.extend({
  name: "ManagerPackCreate",
  components: {
    Navbar,
    Sidebar,
    FoodView,
    QrcodeVue,
    VueHtml2pdf,
  },
  data: (): PackCreateView => {
    return {
      showScreen: "pack",
      foodList: new Array<SelectableFood>(),
      family: {} as Family,
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

      if ("family" in this.$route.params) {
        this.family = this.$route.params.family as unknown as Family;
        this.form.familyId = this.family._id;
      }
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    print() {
      this.isPrinted = true;

      this.$refs.printableData.generatePdf()
    },
    createPack(): void {
      this.foodList.forEach((elem) => {
        if (elem.selected) {
          this.form.foodList.push({ foodId: elem._id, number: elem.selected });
        }
      });

      this.form.expirationDate = moment(
        new Date(Math.max.apply(null, 
          this.foodList
            .filter(f => f.selected)
            .map(f => new Date(f.expirationDate)))))
        .format("YYYY-MM-DD")
      
      this.showScreen = "loading";
      // api
      //   .createPack(this.form)
      //   .then((r: AxiosResponse<Pack>): void => {
      //     console.log(r)
      //     if (r.status == 200) {
      //       eventbus.$emit("successMessage", "Food packs", "Pack successfully created.");

      //       this.form = r.data;
      //       this.showScreen = "printable_info"
      //     }
      //   })
      //   .catch((e: AxiosError): void => {
      //     console.log(e);
      //     eventbus.$emit("errorMessage", "Food packs", "Unable to create a food pack. Retry later or contact us if the problem persists.");
      //   });

      this.form = {
        "_id" : "619bcdfd778094e21b0e690c",
        "foodList" : [ 
            {
                "foodId" : "619bc01e778094e21b0e67c9",
                "number" : 1,
                "_id" : "619bcdfd778094e21b0e690d"
            }, 
            {
                "foodId" : "619bc029778094e21b0e67ce",
                "number" : 1,
                "_id" : "619bcdfd778094e21b0e690e"
            }, 
            {
                "foodId" : "619bc043778094e21b0e67d3",
                "number" : 1,
                "_id" : "619bcdfd778094e21b0e690f"
            }
        ],
        "expirationDate" : "2021-11-17T00:00:00.000Z",
        "status" : "selected",
        "familyId" : "619bc4ec778094e21b0e68c3",
        "__v" : 0,
        "deliveryDate" : "2021-11-23T00:00:00.000Z",
        "deliveryPeriod" : "afternoon",
        "deliveryVolunteerId" : "618d34376460d3f4899710cc"
      }
      this.showScreen = "printable_info"

    },
  },
});
</script>

<style scoped lang="scss"></style>
