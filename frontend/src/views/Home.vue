<template lang="pug">
div
  div.blurred-section.text-center()

    div.color1.px-3.py-4.mb-5.mt-5()
      h1.display-4 BmF
      
    div.my-5.p-3#shadow-text
      h2 Help others
      p.lead Gift foods you dont need and feed needy families.
      div.mt-2(v-if='!$store.getters.isUserLogged')
        b-button.color3(size="lg" @click="$router.push({name: 'Login'})") Sign up

  div.grey-section.text-section.text-center
    b-row(align-h="center").no-gutters
      b-col(cols=10 md=10 lg=6)
        h3.mb-5 WHAT IS BRING ME FOOD?
        p.m-0.p-0 Bring me Food is a web application which enables users to communciate directly with volunteers to donate foods which will e delivered to needing families.
     
  div#banner-section  
    b-row.banner.text-sm-center(align-v="center" align-h="center" no-gutters)
      b-col(cols="11" md="8" lg="auto")
        p.m-0.p-0 Donate foods to needy families
      b-col(cols="11" md="8" lg="auto").ml-3
        b-button(size="lg" variant="light" @click="donateFood") Donate

    b-row.banner.text-sm-center(align-v="center" align-h="center" no-gutters)
      b-col(cols="11" md="8" lg="auto")
        p.m-0.p-0 Help us to find needy families
      b-col(cols="11" md="8" lg="auto").ml-3
        b-button(size="lg" variant="light" @click="subscribeFamily") Subscribe family

  div.py-5.events-container(id="events")
    HomepageEvents

  div.py-5
    CountBoxes

  div#footer
    b-row(align-h="center").mt-5.no-gutters
      b-col(lg=8)
        b-row(align-h="around").no-gutters
          b-col(cols=10 md=5 lg="auto")
            h1.display-4 BmF
            h6 Bring me Food
          b-col(cols=10 md=5 lg="auto")
            b Contact us
            b-row.no-gutters
              b-col(cols="auto")
                Icon.mr-2(source="fa" icon="map-marker") 
              b-col
                p Via a caso n.32, Cesena
            b-row.no-gutters
              b-col(cols="auto")
                Icon.mr-2(source="fa" icon="envelope") 
              b-col
                p info@bringmefood.it
            b-row.no-gutters
              b-col(cols="auto")
                Icon.mr-2(source="fa" icon="phone") 
              b-col
                p +39 123456789
          b-col(cols=10 md=5 lg="auto")
            b Grow with us
            p 
              a(href="#") Become a volunteer
            p
              a(href="#") Donate food
            p
              a(href="#") Submit needing families
          b-col(cols=10 md=5 lg="auto")
            b Legal 
            p
              a(href="#") Terms of use
            p
              a(href="#") Privacy policy
        hr.shaded.mb-1
        b-row.d-flex.flex-row-reverse.no-gutters.mb-1
          b-col.mr-2(cols="auto")
            Icon(source="bt" icon="facebook")
          b-col.mr-2(cols="auto")
            Icon(source="bt" icon="instagram")
          b-col.mr-2(cols="auto")
            Icon(source="bt" icon="youtube")
          b-col.mr-2(cols="auto")
            Icon(source="bt" icon="twitter")

//- b-container
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     h2
//-       b What is BringMeFood?
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     div bla bla bla
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     h2.text-center
//-       b Food donated by category
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     DoughnutChart
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     h2.text-center
//-       b Some data
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     CountBoxes
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     h2.text-center
//-       b Next events
//-   b-row.justify-content-md-center.my-5.no-gutters
//-     HomepageEvents

</template>

<script lang="ts">
import Vue from "vue";

import DoughnutChart from "../components/homepage/DoughnutChart.vue";
import HomepageEvents from "../components/homepage/HomepageEvents.vue";
import CountBoxes from "../components/homepage/CountBoxes.vue";
import Icon from "../components/Icon.vue";

export default Vue.extend({
  name: "Home",
  components: {
    DoughnutChart,
    HomepageEvents,
    CountBoxes,
    Icon,
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }
    }
  },
  methods: {
    donateFood() {
      if(this.$store.getters.isUserLogged) {
        this.$router.push({name: "ManagerDonationCreate"});
      }
    },
    subscribeFamily() {
      if(this.$store.getters.isUserLogged) {
        this.$router.push({name: "ManagerFamilySubscribe"});
      }

    }
  },
});
</script>

<style lang="scss">
@import "@/assets/style.scss";

#shadow-text {
  -webkit-box-shadow: 0px 0px 50px 50px rgba(0,0,0,0.85); 
  box-shadow: 0px 0px 50px 50px rgba(0,0,0,0.85);
  
  background-color: rgba(0, 0, 0, 0.83); 
  
  // -webkit-box-shadow: 0px 0px 50px 25px #000000; 
  // box-shadow: 0px 0px 50px 25px #000000;
}

.blurred-section {
  padding: 20em;
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;

  color: white;

  background-image: url("~@/assets/images/image2_blurred.jpg");

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  
  opacity: 0.9;
  height: 80vh;
}

.grey-section {
  background-color: #f3f3f3;
}

.text-section {
  padding-top: 5em;
  padding-bottom: 5em;
  font-size: 1em;
}

#banner-section > * {
  margin-top: 6em;
  margin-bottom: 6em; 
}

.banner {
  background-color: $color1;
  color: white;
  padding: 2em;
}

.events-container {
  background-image: url("~@/assets/images/repeating_pattern.jpg");
  background-size: 400px 400px;
}

.banner > * {
  font-size: 200%;
}

#footer {
  border-top: 20px solid $color1;
  border-bottom: 10px solid $color1;
  background-color: $color2;

  
  background-image: url("~@/assets/images/footer1.jpg");
  // background-image: url("~@/assets/images/footer2.jpg");
  // background-size: contain;

 
  // background-image: url("~@/assets/images/footer3.jpg");
  // color: $greyscaleD;
}

#footer a {
  color: $color2;
}
</style>
