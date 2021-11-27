<template lang="pug">
div
  GmapMap.mapContainer(
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

  p(class="text-muted")
    small Slide inside the map to reposition the marker if it is not pointing in the exact location you provided. This may help our volunteers to reach you.
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
          this.$emit(
            "locationChange",
            map.getCenter().lat(),
            map.getCenter().lng()
          );
        }.bind(this)
      );
    });
  },
});
</script>

<style scoped lang="scss"></style>
