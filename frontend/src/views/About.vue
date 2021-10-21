<script>
  import api from "@/api"

  export default {
    name: "about",
    created() {

     this.showFoods()
    },
    methods: {
      showFoods() {
        api.getFood().then((response) => {
          console.log(response)
        }).catch(() => {
          console.log("ERROR")
        })
      },
      add() {
        var food = {
          "name": "asd",
          "number": "123",
          "weight": 123,
          "expirationDate": "12/12/2012",
          "description": "",
          "labels": ["a", "b"]
        }
        api.addFood(food)
      }
    }
  }

</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>

    <button v-on:click="add">asd</button>

  </div>
</template>
