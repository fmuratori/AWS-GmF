<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' sm='10')
      div
        hr.shaded
        h4.text-center
          b PACK INFO
        hr.shaded
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg='8' md='10' sm='12')
      div(v-if="showScreen=='scan'")
        b-card.text-center(bg-variant='light')
          h3.mb-3
            font-awesome-icon.mr-2(icon='qrcode')
            span Qr code scanner
          div(v-if="scannerState == 'ready'")
            b-button.color3.m-5(@click='startCamera()') Open camera
          div(v-if="scannerState == 'scanning'")
            qrcode-stream(@decode='onDecode' @init='onInit' :camera='cameraState')
            b-button.color3(block='block' @click='stopCamera()' v-if="scannerState=='scanning'") Close camera
          div(v-if="scannerState == 'error'")
            Icon(fontawesome icon='fas fa-qrcode fa-3x')
            p(v-if='!isMobile') Devi autorizzare l&apos;utilizzo della webcam per scansionare il codice QR
            p(v-else) Devi autorizzare l&apos;utilizzo della fotocamera per scansionare il codice QR
          div(v-if="scannerState=='validating'")
            p Validation...
          div(v-if="scannerState=='valid_success'")
            p Pack identified succesfully.
          div(v-if="scannerState=='valid_error'")
            p Pack unidentified.
            b-button(@click='reloadScanner()' v-if="scannerState=='valid_error' || scannerState=='valid_success'") Riattiva camera
      div(v-if="showScreen=='pack'")
        h3 Pack # {{ pack._id }}
        b-row
          b-col
            b-button.color3(block='block' @click='deliverPack()') Set as delivered
          b-col
            b-button(block='block' variant='secondary' @click='resetView()') Scan another code
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import { QrcodeStream } from "vue-qrcode-reader";
import Icon from "../components/Icon.vue";

import { Pack } from "../types";

import packApi from "../api/pack";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerPackScan",
  components: {
    QrcodeStream,
    Icon,
  },
  data: () => {
    return {
      showScreen: "scan",
      isScannerVisible: false,
      result: "",
      isMobile: false,
      cameraState: "auto",
      scannerState: "ready",
      isScannerFullscreen: false,
      pack: {} as Pack,
    };
  },
  created() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!this.$store.getters.isUserLogged) this.$router.push({ name: "Login" });
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
      console.log(result);
      if (result != "") {
        this.result = result;

        this.scannerState = "validating";

        packApi
          .packListExpanded({ _id: result })
          .then((r: AxiosResponse<Pack>) => {
            if (r.status == 200) {
              this.scannerState = "valid_success";
              this.showScreen = "pack";
              this.pack = r.data;
            }
          })
          .catch((e: AxiosError) => {
            console.log(e);
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

    async onInit(promise: any) {
      promise.catch((error: { name: string }) => {
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
            errorMessage = "ERROR: secure context required (HTTPS, localhost)";
            break;
          case "NotReadableError":
            errorMessage = "ERROR: is the camera already in use?";
            break;
          case "OverconstrainedError":
            errorMessage = "ERROR: installed cameras are not suitable";
            break;
          case "StreamApiNotSupportedError":
            errorMessage = "ERROR: Stream API is not supported in this browser";
            break;
        }
        eventbus.$emit("errorMessage", "PACK SCANNER", errorMessage);
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

<style scoped lang="scss"></style>
