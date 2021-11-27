<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(cols=4)
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b PACK SCANNER
      hr.sidebar-hr.my-3

      div(v-if="showScreen='scan'")
        qrcode-stream(@decode="onDecode" @init="onInit" :camera="cameraState" v-if="scannerState == 'scanning'")
          
          div(class="buttons")
            b-button(variant="light" @click="toggleFullScreen()" 
            v-if="scannerState=='scanning'"
            ref="compressButton") 
              b-icon(icon="arrows-angle-contract")
            
            b-button(variant="light" @click="toggleFullScreen()" 
            v-if="scannerState=='scanning'"
            ref="expandButton") 
              b-icon(icon="arrows-angle-expand")

            b-button(variant="light" @click="stopCamera()" v-if="scannerState=='scanning'") Disattiva camera
          
        div(v-if="scannerState == 'ready'")
          b-button(variant="light" @click="startCamera()" v-if="scannerState=='ready'") Attiva camera

        div(v-if="scannerState == 'error'")
          font-awesome-icon(icon="fas fa-qrcode fa-3x")
          p(v-if="!isMobile") Devi autorizzare l&apos;utilizzo della webcam per scansionare il codice QR
          p(v-else) Devi autorizzare l&apos;utilizzo della fotocamera per scansionare il codice QR
        div(class="is-flex is-flex-direction-column is-align-items-center" v-if="scannerState=='validating'")
          div(class="mb-3 my-loader loader is-loading")
          p Validazione...

        div(v-if="scannerState=='valid_success'")
          span(class="icon has-text-success is-large")
            i(class="fas fa-check fa-3x")
          p(class="block has-text-success") Acquisizione del pacco avvenuta con successo.

        div(v-if="scannerState=='valid_error'")
          span(class="icon has-text-danger is-large")
            i(class="fas fa-times fa-3x")
          p(class="block has-text-danger") Il pacco è inesistente o inaccessibile.
          
          button(class="button " @click="reloadScanner()" v-if="scannerState=='valid_error' || scannerState=='valid_success'") Riattiva camera

      div(v-if="showScreen=='pack'")

</template>

<script lang="ts">
import Vue from "vue";
import {QrcodeStream} from "vue-qrcode-reader"

import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import packApi from "../api/pack";

import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerPackScan",
  components: {
    Navbar,
    Sidebar,
    QrcodeStream,
  },
  data: () => {
    return {
      showScreen: "scan",
      isScannerVisible: false,
      result: "",
      isMobile: false,
      cameraState: "auto",
      scannerState: "ready",
      isScannerFullscreen: false
    };
  },
  created() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)      
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }
    } else this.$router.push({ name: "Login" });
  },
  mounted() {
    this.startCamera()
  },
  methods: {
    startCamera() {
      this.scannerState = "scanning"
    },
    stopCamera() {
      if (this.isScannerFullscreen)
        this.toggleFullScreen()
      this.scannerState = "ready"
    },

    toggleFullScreen() {
      this.isScannerFullscreen = !this.isScannerFullscreen

      if(!this.isScannerFullscreen) {
        this.$refs.expandButton.style.display="block"
        this.$refs.compressButton.style.display="none"
      } else {
        this.$refs.expandButton.style.display="none"
        this.$refs.compressButton.style.display="block"  
      }
    },

    onDecode(result) {
      console.log(result);
      if (result != "") {
        this.result = result;

        this.scannerState = "validating"
        if (this.isScannerFullscreen)
          this.toggleFullScreen()
        
        const payload = {
          filter: {
            "_id": result
          }
        }
        packApi.packList(result).then((r: AxiosResponse) => {
          console.log(r)
          if (r.status == 200) {
            this.scannerState = "valid_success";
            // this.showScreen = "pack";
          }
        })
        .catch((e: AxiosError) => {
          console.log(e)
          this.scannerState = "valid_error";
        });
        // var params = {
        //   key: result.split(":")[1],
        //   language: "it",
        //   data: result.split(":")[2],
        //   tags: []
        // }
        // api.retrieveForm(params).then(response => {
        //   if (response.status == 200) {
        //     this.$router.replace({name: "questionnaire-info", 
        //       params: { data: response.data }})
        //     this.scannerState = "valid_success"
        //   } else {
        //     this.scannerState = "valid_error"
        //   }
        // }).catch(() => {
        //   this.scannerState = "valid_error"
        // })
      }
    },

    reloadScanner() {
      this.startCamera();
    },

    async onInit(promise) {
      this.$refs.expandButton.style.display="block"
      this.$refs.compressButton.style.display="none"
      promise.then(() => {
        console.log("intiialized")

      })
      .catch((error) => {
        this.scannerState = "error";

        var errorMessage = ""
        switch(error.name) {
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
      })
    }
  }
});
</script>

<style scoped lang="scss"></style>
