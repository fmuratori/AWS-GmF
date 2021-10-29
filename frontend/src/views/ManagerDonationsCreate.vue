<template lang="pug">
  b-row(class="justify-content-md-center my-5 no-gutters")
    b-col(cols="6")
      p CREA UNA DONAZIONE
      b-form()
        b-form-group(id="input-group-1" label="Alimenti:" label-for="input-1") 
          b-input-group(v-for="(value, idx) in form.foods" :key="idx" class="mb-1")
            b-form-input(id="input-1" type="text" placeholder="" class="my-no-right-border" 
            @input="foodInputValueChange(idx)" v-model="form.foods[idx]")
            b-input-group-append
              b-button(variant="danger" class="my-no-left-border" @click="foodDeleteClicked(idx)"
              :disabled="form.foods[idx] == ''") 
                span Cancella
                b-icon(icon="x" aria-hidden="true")

        b-form-group(id="input-group-2" label="Data scadenza donazione:" label-for="input-2")
          b-input-group
            b-form-datepicker(id="input-2" required="" v-model="form.date" reset-button close-button 
            class="my-no-right-border")
            b-input-group-append
              b-button(variant="danger" class="my-no-left-border" @click="form.date = null"
              :disabled="form.date == null") 
                span Cancella
                b-icon(icon="x" aria-hidden="true")

        div(class="mb-3")
          label() Luogo ritiro:
          b-card()
            b-row
              b-col(cols=8)
                b-form-group(id="input-group-3" label="Città:" label-for="input-3")
                  b-form-input(id="input-3" type="text" v-model="form.location.city")
              b-col(cols=4)
                b-form-group(id="input-group-8" label="CAP:" label-for="input-8")
                  b-form-input(id="input-8" type="text" v-model="form.location.cap")
            b-row
              b-col(cols=8)
                b-form-group(id="input-group-4" label="Indirizzo:" label-for="input-4")
                  b-form-input(id="input-4" type="text" v-model="form.location.address")
              b-col(cols=4)
                b-form-group(id="input-group-5" label="Numero civico:" label-for="input-5")
                  b-form-input(id="input-5" type="text" v-model="form.location.civicNumber")
            div(class="text-center")
              b-button(variant="outline-secondary") Cerca su maps

        b-form-group(id="input-group-6" label="Informazioni aggiuntive:" label-for="input-6")
          b-form-textarea(id="input-6" rows="3" max-rows="6" v-model="form.info")
          
        b-form-group(id="input-group-7" label="Periodo di ritiro:" label-for="input-7")
          b-row(v-for="(weekDay, idx) in form.weekDays" :index="idx" class="mb-1")
            b-col(cols="2")
              label {{ weekDay.name }}
            b-col(cols="10")
              b-button-group(class="d-flex")
                b-button(@click="weekDayButtonClick(weekDay.name, 'morning')" :variant="computeButtonVariant(weekDay.times, 'morning')") Mattino
                b-button(@click="weekDayButtonClick(weekDay.name, 'afternoon')" :variant="computeButtonVariant(weekDay.times, 'afternoon')") Pomeriggio
                b-button(@click="weekDayButtonClick(weekDay.name, 'evening')" :variant="computeButtonVariant(weekDay.times, 'evening')") Sera

        b-row
          b-col
            b-button(block variant="outline-danger") Annulla
          b-col
            b-button(block variant="success") Procedi
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default Vue.extend({
  name: "ManagerDonationsCreate",
  components: {
    Navbar,
    Sidebar,
  },
  data: function () {
    return {
      form: {
        foods: [""],
        date: null,
        location: {
          city: "",
          address: "",
          civicNumber: "",
          cap: "",
        },
        info: "",
        weekDays: [
          // TODO: mettere valori diin inglese
          {
            name: "Lunedì",
            times: [],
          },
          {
            name: "Martedì",
            times: [],
          },
          {
            name: "Mercoledì",
            times: [],
          },
          {
            name: "Giovedì",
            times: [],
          },
          {
            name: "Venerdì",
            times: [],
          },
          {
            name: "Sabato",
            times: [],
          },
          {
            name: "Domenica",
            times: [],
          },
        ],
      },
    }
  },
  created() {
    this.$store.dispatch("showSidebar");
  },
  methods: {
    computeButtonVariant(times: string[], time: string) {
      return times.includes(time) ? "dark" : "outline-secondary";
    },
    foodInputValueChange(inputIdx: number) {
      if (inputIdx == this.form.foods.length - 1) {
        this.form.foods.push("");
      } else if (this.form.foods[inputIdx] == "") {
        this.foodDeleteClicked(inputIdx);
      }
    },
    foodDeleteClicked(inputIdx: number) {
      this.form.foods.splice(inputIdx, 1);
    },
    weekDayButtonClick(name: string, time: string) {
      const idx: number = this.form.weekDays.findIndex(
        (wd: { name: string; }) => wd.name == name);
      if (idx != -1) {
        const selectedTimes: string[] = this.form.weekDays[idx].times;
        const times: number = selectedTimes.indexOf(time);
        if (times != -1) {
          selectedTimes.splice(times, 1);
        } else {
          selectedTimes.push(time);
        }
      }
    },
  },
});
</script>

<style lang="scss">
.my-no-left-border {
  border-top-left-radius: 0px 0px;
  border-bottom-left-radius: 0px 0px;
  border-left: 0px;
}
.my-no-right-border {
  border-top-right-radius: 0px 0px;
  border-bottom-right-radius: 0px 0px;
  border-right: 0px;
}
</style>
