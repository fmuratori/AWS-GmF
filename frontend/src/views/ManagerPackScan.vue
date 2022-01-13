<template lang="pug">
b-container.mb-5
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      div
        hr.shaded
        h4.text-center
          b PACK SCANNER
        hr.shaded
  b-row.justify-content-center.my-5.no-gutters
    b-col(lg='6' md='10' cols='11')
      div(v-if="showScreen=='scan'")
        b-card.text-center(bg-variant='light' no-body)
          template(#header)
            h3.mb-0
              font-awesome-icon.mr-2(icon='qrcode')
              span Qr code scanner

          b-card-text
            div(v-if="scannerState == 'ready'")
              b-button.color3.m-5(@click='startCamera()') Open camera
            div(v-if="scannerState == 'scanning'")
              qrcode-stream(@decode='onDecode' @init='onInit' :camera='cameraState')
                p(v-if="isLoading").mt-5 Loading ...
              b-button.footerCardButton.color3(block='block' @click='stopCamera()' v-if="scannerState=='scanning'") Close camera
            div(v-if="scannerState == 'error'")
              Icon(fontawesome icon='fas fa-qrcode fa-3x')
              p(v-if='!isMobile') Devi autorizzare l&apos;utilizzo della webcam per scansionare il codice QR
              p(v-else) Devi autorizzare l&apos;utilizzo della fotocamera per scansionare il codice QR
            div(v-if="scannerState=='validating'")
              p.m-5 
                i Validation...
            div(v-if="scannerState=='valid_success'")
              p.m-5 
                i Pack identified succesfully.
            div(v-if="scannerState=='valid_error'")
              p.m-5 
                i Pack unidentified.
          b-button.footerCardButton(@click='reloadScanner()' v-if="scannerState=='valid_error' || scannerState=='valid_success'") Restart camera
      div(v-if="showScreen=='pack'")
        b-card.mb-3(bg-variant='light')
          h3 Pack # {{ pack._id }}
          b-row.justify-contect-center(align-h='center')
            b-col.mb-3(cols='11' md='6')
              h4.mb-2 Family info
              div
                b Name:&nbsp;
                span {{ pack.family.name }}
              div
                b Components:&nbsp;
                span {{ pack.family.components }}
              div
                b Phone number:&nbsp;
                span {{ pack.family.phoneNumber }}
              div
                b Address:&nbsp;
                span {{ pack.family.address.street + " " + pack.family.address.civicNumber + ", " + pack.family.address.city }}
            b-col(cols='11' md='6')
              h4.mb-2 Foods
              ul.mb-1.pl-4(v-if='pack.foodList.length > 0')
                li.ml-0.pl-0(v-for='(food, idx) in pack.foodList' :key='idx')
                  span {{ food.name }} x{{ food.selected }} 
              div
                b Pack expiration date:&nbsp;
                span {{ dates.formatDate(packExpirationDate) }}
        b-row
          b-col
            b-button(block='block' variant='secondary' @click='resetView()') Scan another code
          b-col
            b-button.color3(block='block' @click='deliverPack()') Set as delivered
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import { QrcodeStream } from "vue-qrcode-reader";
import Icon from "../components/Icon.vue";

import { Pack } from "../types/types";
import { ManagerPackScanView } from "../types/viewTypes";

import packApi from "../api/pack";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerPackScan",
  components: {
    QrcodeStream,
    Icon,
  },
  data: (): ManagerPackScanView => {
    return {
      showScreen: "scan",
      isScannerVisible: false,
      result: "",
      isMobile: false,
      cameraState: "auto",
      scannerState: "ready",
      isScannerFullscreen: false,
      pack: {} as Pack,
      isLoading: false,
    };
  },
  created() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },
  mounted() {
    this.startCamera();
  },
  methods: {
    startCamera() {
      this.scannerState = "scanning";
    },
    stopCamera() {
      this.scannerState = "ready";
    },

    onDecode(result: string) {
      if (result != "") {
        this.result = result;

        this.scannerState = "validating";

        packApi
          .packListExpanded({ _id: result })
          .then((r: AxiosResponse<Pack>) => {
            console.log(r);
            if (r.status == 200 && r.data) {
              this.scannerState = "valid_success";
              this.showScreen = "pack";
              this.pack = r.data;
            } else {
              this.scannerState = "valid_error";
              eventbus.$emit(
                "errorMessage",
                "Pack info",
                "Unable to retrieve pack info, retry later or contact us if the problem persists."
              );
            }
          })
          .catch((e: AxiosError) => {
            console.log(e);
            this.scannerState = "valid_error";
            eventbus.$emit(
              "errorMessage",
              "Pack info",
              "Unable to retrieve pack info, retry later or contact us if the problem persists."
            );
            this.scannerState = "valid_error";
          })
          .then(() => eventbus.$emit("stopLoading"));
      }
    },

    reloadScanner() {
      this.startCamera();
    },

    async onInit(promise: Promise<any>) {
      this.isLoading = true;
      eventbus.$emit("startLoading", "Opening device camera");
      promise
        .catch((error: { name: string }) => {
          this.scannerState = "error";

          var errorMessage = "";
          switch (error.name) {
            case "NotAllowedError":
              errorMessage = "ERROR: you need to grant camera access permisson";
              break;
            case "NotFoundError":
              errorMessage = "ERROR: no camera on this device";
              break;
            case "NotSupportedError":
              errorMessage =
                "ERROR: secure context required (HTTPS, localhost)";
              break;
            case "NotReadableError":
              errorMessage = "ERROR: is the camera already in use?";
              break;
            case "OverconstrainedError":
              errorMessage = "ERROR: installed cameras are not suitable";
              break;
            case "StreamApiNotSupportedError":
              errorMessage =
                "ERROR: Stream API is not supported in this browser";
              break;
          }
          eventbus.$emit("errorMessage", "PACK SCANNER", errorMessage);
        })
        .then(() => {
          this.isLoading = false;
          eventbus.$emit("stopLoading");
        });
    },
    deliverPack() {
      packApi
        .setDelivered({ id: this.pack._id })
        .then((r: AxiosResponse) => {
          if (r.status == 200) {
            eventbus.$emit(
              "successMessage",
              "PACK DELIVERY",
              "Pack delivered succesfully."
            );
            this.resetView();
          } else {
            eventbus.$emit(
              "errorMessage",
              "PACK DELIVERY",
              "Unable to set the specified pack as delivere. Retry later or contact us if the problem persists."
            );
          }
        })
        .catch((e: AxiosError) => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "PACK DELIVERY",
            "Unable to set the specified pack as delivere. Retry later or contact us if the problem persists."
          );
        });
    },
    deletePack() {
      packApi
        .deletePack({ id: this.pack._id })
        .then((r: AxiosResponse) => {
          if (r.status == 200) {
            eventbus.$emit(
              "successMessage",
              "PACK DELIVERY",
              "Pack deleted succesfully."
            );
            this.resetView();
          } else {
            eventbus.$emit(
              "errorMessage",
              "PACK DELIVERY",
              "Unable to delete the specified pack. Retry later or contact us if the problem persists."
            );
          }
        })
        .catch((e: AxiosError) => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "PACK DELIVERY",
            "Unable to delete the specified pack. Retry later or contact us if the problem persists."
          );
        });
      this.resetView();
    },
    resetView() {
      this.scannerState = "ready";
      this.showScreen = "scan";
      this.pack = {} as Pack;
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.scannerBody {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  height: 0px;
  background-color: $greyscaleD;
}
</style>
