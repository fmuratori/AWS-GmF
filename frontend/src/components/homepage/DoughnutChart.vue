<template lang="pug">
canvas#pie-chart
</template>

<script lang="ts">
import Vue from "vue";
import { Chart, ChartItem, registerables } from "chart.js";

import foodApi from "../../api/food";
import { AxiosResponse } from "axios";
import { ChartDataResponse } from "../../types";

Chart.register(...registerables);

export default Vue.extend({
  name: "DoughnutChart",
  mounted() {
    foodApi.getChartData().then((r: AxiosResponse<ChartDataResponse>): void => {
      const ctx = document.getElementById("pie-chart");
      new Chart(ctx as ChartItem, {
        type: "doughnut",
        data: {
          labels: ["meat", "fish", "pasta", "vegetable", "fruit"],
          datasets: [
            {
              label: "si",
              data: [
                r.data.meat,
                r.data.fish,
                r.data.pasta,
                r.data.vegetable,
                r.data.fruit,
              ],
              backgroundColor: [
                "#9966ff",
                "#c9cbcf",
                "#ff6384",
                "#ff9f40",
                "#ffcd56",
                "#4bc0c0",
                "#36a2eb",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              text: "Food donated by category",
            },
          },
        },
      });
    });
  },
});
</script>

<style scoped lang="scss"></style>
