<template lang="pug">
  b-navbar(toggleable="lg" type="dark" id="navbar" sticky)
    b-navbar-brand(href="#")
      h3 Bring me Food
    
    b-navbar-nav(class="ml-auto mr-2" v-if="$store.getters.isMediumScreenWidth && $store.getters.isUserLogged")
      b-nav-item(href="#" class="my-auto text-center" )
        b-button(type="submit" variant="danger" class="my-2 my-sm-0" id="navbar-messages-button")
          b-icon(icon="envelope" class="mr-1")
          b-badge(variant="light") 4
    b-navbar-nav(class="mr-2" v-if="$store.getters.isMediumScreenWidth && $store.getters.isUserLogged")
      b-nav-item(href="#" class="my-auto text-center")
        b-button(type="submit" variant="light" class="my-2 my-sm-0" @click="toggleSidebar()")
          font-awesome-icon(icon="cogs")
    b-navbar-nav(v-if="$store.getters.isMediumScreenWidth")
      b-nav-item(href="#" class="my-auto text-center")
        b-button(type="submit" variant="light" class="my-2 my-sm-0" @click="isOpen = !isOpen")
          font-awesome-icon(v-if="isOpen" icon="times")
          font-awesome-icon(v-else icon="bars")
    
    b-collapse#nav-collapse(is-nav="" v-model="isOpen")
      b-navbar-nav(class="ml-auto")
        b-nav-item(href="#" class="my-auto navbar-link text-center" @click="$router.replace({name: 'Home'})") Home
        b-nav-item(href="#" class="my-auto navbar-link text-center") Eventi
        b-nav-item(href="#" class="my-auto navbar-link text-center") Domande
        b-nav-item(href="#" class="my-auto text-center" v-if="!$store.getters.isMediumScreenWidth && $store.getters.isUserLogged")
          b-button(type="submit" variant="danger" class="my-2 my-sm-0" id="navbar-messages-button")
            span(class="mr-1") Messaggi
            b-badge(variant="light") 4
        b-nav-item(href="#" class="my-auto text-center" v-if="$store.getters.isUserLogged")
          b-button(type="submit" variant="light" class="my-2 my-sm-0" @click="$router.replace({name: 'ManagerHome'})")
            span(class="mr-1") Area personale
            font-awesome-icon(icon="cogs")
        b-nav-item(href="#" class="my-auto navbar-link text-center" v-if="$store.getters.isUserLogged" @click="logout()") 
          span(class="mr-1") Disconnetti
          font-awesome-icon(icon="sign-out-alt")
        b-nav-item(href="#" class="my-auto navbar-link text-center" @click="$router.replace({name: 'Login'})" v-if="!$store.getters.isUserLogged") 
          b-button(type="submit" variant="light" class="my-2 my-sm-0")
            span(class="mr-1") Connetti
            font-awesome-icon(icon="sign-in-alt")
        
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Navbar",
  data: function() {
    return {
      isOpen: false,
    }
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar");
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace({name: "Home"});
    }
  },
});
</script>

<style scope lang="scss">

@import "@/assets/style.scss";

#navbar {
  background-color: $color1;
}

#navbar-messages-button {
  background-color: $color3;
}

.navbar-link > * {
  color: $greyscaleE !important;
}
</style>
