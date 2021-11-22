<template lang="pug">
GmapMap#gmap(
  :options="mapsOptions",
  :center="{ lat: xCoord, lng: yCoord }",
  :zoom="14",
  map-type-id="terrain",
  ref="mapRef"
)
  GmapMarker(
    :key="0",
    :position="{ lat: xCoord, lng: yCoord }",
    :clickable="false",
    :draggable="true"
  )
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputAddress",
  props: {
    x: Number,
    y: Number,
  },
  data: () => {
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
        gmapCenter: null,
      },
    };
  },
  created() {
    this.xCoord = this.x;
    this.yCoord = this.y;
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then((map) => {
      map.addListener(
        "dragend",
        function () {
          this.xCoord = map.getCenter().lat();
          this.yCoord = map.getCenter().lng();
          this.$emit("locationChange", map.getCenter().lat(), map.getCenter().lng());
        }.bind(this)
      );
    });
  },
});
</script>

<style scoped lang="scss">
#gmap {
  height: 300px;
  width: 300px;
}
</style>
