<template lang="pug">
b-row.text-center.no-gutters(align-h="center")
  b-col(cols=6 md=4 lg=2 v-for='elem in [food, verifiedFamilies, deliveredPacks]')
    h1 {{ elem.count }}
    h6.pre-formatted {{ elem.message }}
</template>

<script lang="ts">
import Vue from "vue";

import { CountDataResponse } from "../../types/types";

import { AxiosResponse } from "axios";
import api from "../../api/data";

export default Vue.extend({
  name: "CountBoxes",
  data: () => {
    return {
      food: {
        count: 0,
        message: "DONATED\nFOOD",
      },
      verifiedFamilies: {
        count: 0,
        message: "REPORTED\nFAMILIES",
      },
      deliveredPacks: {
        count: 0,
        message: "DELIVERED\nPACKS",
      },
    };
  },
  mounted() {
    api.getCountsData().then((r: AxiosResponse<CountDataResponse>): void => {
      this.food.count = r.data.foodCount;
      this.verifiedFamilies.count = r.data.verifiedFamilies;
      this.deliveredPacks.count = r.data.deliveredPacks;
    });
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.pre-formatted {
  white-space: pre;
}
</style>
