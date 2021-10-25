<template lang="pug">
  div
    b-navbar(toggleable="lg" type="dark" variant="info")
      b-navbar-brand(href="#") Bring me Food
      b-navbar-toggle(target="nav-collapse")
      b-collapse#nav-collapse(is-nav="")
        // Right aligned nav items
        b-navbar-nav.ml-auto
          b-nav-item(href="#").my-auto Home
          b-nav-item(href="#").my-auto Eventi
          b-nav-item(href="#").my-auto Domande
          b-nav-item(href="#").my-auto Disconnetti
          b-nav-item(href="#").my-auto
            b-button.my-2.my-sm-0(type="submit") Operazioni
          b-nav-item(href="#").my-auto  
            b-button.my-2.my-sm-0(type="submit" variant="danger")
              span(class="mr-2") Messaggi
              b-badge(variant="light") 4
          b-nav-item(href="#")
            b-icon-person-circle(font-scale="2.5")
        
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Navbar",
  props: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass"></style>
