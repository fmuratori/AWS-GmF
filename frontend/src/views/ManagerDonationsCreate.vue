<template lang="pug">
  div()
    Navbar
    b-container(fluid)
      b-row()
        b-col(class="bg-light" md="auto" align-self="stretch")
          Sidebar
        b-col(cols="9")
          b-row(class="justify-content-md-center my-5")
            b-col(cols="8")
              p CREA DONAZIONE

              b-form()
              
                b-form-group(id="input-group-1" label="Alimenti:" label-for="input-1") 
                  b-row
                    b-col(class="pr-0")
                      b-form-input(id="input-1" type="text" placeholder="Alimento 1" class="my-no-right-border")
                    b-col(md="auto" class="pl-0") 
                      b-button(variant="danger" class="my-no-left-border") 
                        span Cancella
                        b-icon(icon="x" aria-hidden="true")



                b-form-group(id="input-group-2" label="Data scadenza donazione:" label-for="input-2")
                  b-form-datepicker(id="input-2" required="")

                b-form-group(id="input-group-3" label="Città:" label-for="input-3")
                  b-form-input(id="input-3" type="text")
                b-form-group(id="input-group-4" label="Indirizzo:" label-for="input-4")
                  b-form-input(id="input-4" type="text")
                b-form-group(id="input-group-5" label="Numero civico:" label-for="input-5")
                  b-form-input(id="input-5" type="text")
                b-form-group(id="input-group-6" label="Informazioni aggiuntive:" label-for="input-6")
                  b-form-textarea(id="input-6" rows="3" max-rows="6")
                  
                b-form-group(id="input-group-7" label="Periodo di ritiro:" label-for="input-7")
                  b-row(v-for="day in this.weekDays" :index="day.key")
                    b-col(cols="3")
                      b-form-checkbox(value="me") {{ day }}
                    b-col(cols="9")
                      b-button-group(class="d-flex")
                        b-button(variant="light") Mattino
                        b-button(variant="light") Pomeriggio
                        b-button(variant="light") Sera

                b-row
                  b-col
                    b-button(block variant="danger") Annulla
                  b-col
                    b-button(block variant="success") Procedi

                //- b-form-group(id="input-group-3" label="Food:" label-for="input-3")
                //-   b-form-select(id="input-3" v-model="form.food" :options="foods" required="")
                //- b-form-group(id="input-group-4" v-slot="{ ariaDescribedby }")
                //-   b-form-checkbox-group(id="checkboxes-4" v-model="form.checked" :aria-describedby="ariaDescribedby")
                //-     b-form-checkbox(value="me") Check me out
                //-     b-form-checkbox(value="that") Check that out

  
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
      weekDays: ["Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
        "Domenica",
      ],
      form: {
        foods: [],
      },
    }
  },
});
</script>

<style>
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
