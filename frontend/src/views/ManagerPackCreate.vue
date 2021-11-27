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
      
      b-card()
        h3 Pack # {{ form._id }}
        b-row(align-v="center" align-h="center").my-3
          b-col(cols="auto") 
            QrcodeVue(:value="form._id" size="200" level="L")
          b-col(md=10 lg="auto")
            div
              h4.mb-0 Family
              p.mb-0 Name: {{ form.family.name}}
              p.mb-0 Address: {{ form.family.address.city }}, {{ form.family.address.street }} - {{ form.family.address.civicNumber }} 
            hr
            div
              h4.mb-0 Foods
              div.mb-2(v-for="(food, idx) in form.foodList" :key="idx")
                p.mb-0 Name: {{ food.name}}
                p.mb-0 Quantity: {{ food.number}}
                p.mb-0 Expiration date: {{ food.expirationDate}}
              
        div
          b-button(v-if="!isPrinted" block @click="print()") Print pack info
          b-button(v-if="isPrinted" block variant="success" @click="print()") 
            b-icon(icon="check")
            span Pack info printed
          b-button(block @click="$router.push({ name: 'ManagerFamilyList' });") Create another pack
          b-button(block @click="$router.push({ name: 'ManagerPackDelivery' });") Reserve a pack


      vue-html2pdf(
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
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
              b-row(align-v="center")
                b-col(cols="auto") 
                  QrcodeVue(:value="form._id" size="200" level="L").ml-4.mx-3
                b-col
                  div
                    h4.mb-0 Family
                    p.mb-0 Name: {{ form.family.name}}
                    p.mb-0 Address: {{ form.family.address.city }}, {{ form.family.address.street }} - {{ form.family.address.civicNumber }} 
                  hr
                  div
                    h4.mb-0 Foods
                    div.mb-2(v-for="(food, idx) in form.foodList" :key="idx")
                      p.mb-0 Name: {{ food.name}}
                      p.mb-0 Quantity: {{ food.number}}
                      p.mb-0 Expiration date: {{ food.expirationDate}}
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

import packApi from "../api/pack";
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
      packApi.createPack(this.form).then((r: AxiosResponse<Pack>): void => {
        if (r.status == 200) {
          eventbus.$emit("successMessage", "Food packs", "Pack successfully created.");
      
          packApi.getPackInfo(r.data._id).then((r2: AxiosResponse<Pack>): void => {
            if (r2.status == 200) {
              this.form = r2.data;
              this.showScreen = "printable_info";
            }
          })
          .catch((e2: AxiosError): void => {
            console.log(e2);
            eventbus.$emit("errorMessage", "Food packs", "Unable to find the specified pack. Retry later or contact us if the problem persists.");
          });

        }
      })
      .catch((e: AxiosError): void => {
        console.log(e);
        eventbus.$emit("errorMessage", "Food packs", "Unable to create a food pack. Retry later or contact us if the problem persists.");
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
