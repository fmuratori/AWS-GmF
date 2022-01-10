<template lang="pug">
div
  GmapMap.mapContainer(:options='mapsOptions' :center='{ lat: xCoord, lng: yCoord }' :zoom='14' map-type-id='terrain' ref='mapRef')
    GmapMarker(:key='0' :position='{ lat: xCoord, lng: yCoord }' :clickable='false' :draggable='true')

  b-button#mapCloseButton(@click="$emit('resetEvent')")
    Icon(fontawesome icon="trash-alt")

  b-button#mapHelpButton()
    Icon(fontawesome icon="question")

  b-tooltip(target="mapHelpButton" title="How to use") Slide inside the map to reposition the marker if it is not pointing in the exact location you provided. This may help our volunteers to reach you.
</template>

<script lang="ts">
import Vue from "vue";
import { MapLocationComponent } from "../types/componentTypes";
import Icon from "./Icon.vue";

export default Vue.extend({
  name: "MapLocation",
  components: {
    Icon,
  },
  props: {
    x: Number,
    y: Number,
  },
  data: (): MapLocationComponent => {
    return {
      xCoord: 0,
      yCoord: 0,
      mapsOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
        disableDefaultUi: false,
        clickableIcons: false,
      },
    };
  },
  created() {
    this.xCoord = this.x;
    this.yCoord = this.y;
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.mapRef.$mapPromise.then((map: any) => {
        map.addListener(
          "dragend",
          function () {
            this.xCoord = map.getCenter().lat();
            this.yCoord = map.getCenter().lng();
            this.$emit(
              "locationChange",
              map.getCenter().lat(),
              map.getCenter().lng()
            );
          }.bind(this)
        );
      });
    });
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.mapButton {
  z-index: 2;
  position: absolute;
  -webkit-box-shadow: 0px 0px 5px 0px $greyscaleA;
  box-shadow: 0px 0px 5px 0px $greyscaleA;
}

.mapGoogleButton {
  background-color: $greyscaleF;
  border-radius: 2px;
  color: $greyscale6;
  border: 1px;
}

#mapCloseButton {
  @extend .mapButton;
  @extend .mapGoogleButton;

  top: 10px;
  left: 10px;
}

#mapHelpButton {
  @extend .mapButton;
  @extend .mapGoogleButton;

  bottom: 20px;
  left: 10px;
}
</style>
