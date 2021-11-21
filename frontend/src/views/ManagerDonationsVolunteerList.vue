<template lang="pug">
b-container.justify-content-center.my-5
  p TUE DONAZIONI

  b-row.mb-2(no-gutters)
    b-col(cols="auto")
    p Ordina per:
    b-col
      b-button.ml-2(
        pill,
        variant="secondary",
        size="sm",
        @click="orderBy('pickUp_date')",
        :class="{ 'my-button-selected': orderByMode == 'pickUp_date' }"
      ) Data ritiro
      b-button.ml-2(
        pill,
        variant="secondary",
        size="sm",
        @click="orderBy('unread_messages')",
        :class="{ 'my-button-selected': orderByMode == 'unread_messages' }"
      ) Messaggi non letti

  b-row
    b-col(
      sm=12,
      md=6,
      v-if="donations.length == 0 && groupedDonations.length == 0"
    ) 
      p Nessuna donazione prenotata per il ritiro. Assicurati di aver selezionato correttamente i filtri oppure premi #[a(href="#", @click="$router.push({ name: 'ManagerDonationsRetrieve' })") qui] per selezionare donazioni da ritirare.

    b-col(
      v-if="donations.length != 0 && orderByMode == 'unread_messages'",
      sm=12,
      md=6,
      v-for="(donation, idx) in donations",
      :key="idx"
    )
      b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
        b-card-text
          .px-4.pt-4
            h5 Data ritiro: {{ formatDonation(donation) }}
            b-row
              b-col(cols="auto")
                div(class="")
                  p.mb-0 Alimenti donati:
                  p.font-weight-bold.mb-2(
                    v-for="(food, idx) in donation.foods",
                    :key="idx"
                  ) {{ food }}
                div(class="")
                  p.mb-0 Scade tra:
                  p.font-weight-bold.mb-2 {{ getExpirationDays(donation) }} giorni
                //- div 
                //-   p(class="mb-0") Orari disponibili per il ritiro:
                //-   p(class="font-weight-bold") 12/12/2012 
                //-     span(class="font-weight-normal") Scade tra 12 giorni
                div(class="")
                  p.mb-0 Luogo ritiro:
                  p.font-weight-bold {{ donation.address.street + ' ' + donation.address.civicNumber + ', ' + donation.address.city }}
              b-col(cols="auto")
                .mb-2
                  p.mb-0 Stato donazione:
                  h5
                    b-badge(
                      v-if="donation.status == 'waiting'",
                      variant="warning"
                    ) In attesa di valutazione
                    b-badge(
                      v-if="donation.status == 'selected'",
                      variant="success"
                    ) Prenotato per il ritiro
                    b-badge(
                      v-if="donation.status == 'withdrawn'",
                      variant="secondary"
                    ) Ritirato
                .mb-2(v-if="hasUnreadMessages(donation._id)")
                  a(href="#") Hai {{ unreadMessagesCount(donation._id) }} messaggi non letti
          b-button.b-card-footer-button(
            block,
            @click="inspectDonation(donation)"
          ) Mostra

    b-col(
      v-if="groupedDonations.length != 0 && orderByMode == 'pickUp_date'",
      cols=12,
      v-for="(donations, idx) in groupedDonations",
      :key="idx"
    )
      b-row
        b-col(cols="auto")
          p.font-weight-bolder Data: {{ moment(donations.date).format('DD-MM-YYYY') }}
        b-col
          hr
      b-row
        b-col(
          sm=12,
          md=6,
          v-for="(donation, idx) in donations.donations",
          :key="idx"
        )
          b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
            b-card-text
              .px-4.pt-4
                h5 Data ritiro: {{ formatDonation(donation) }}
                b-row
                  b-col(cols="auto")
                    div(class="")
                      p.mb-0 Alimenti donati:
                      p.font-weight-bold.mb-2(
                        v-for="(food, idx) in donation.foods",
                        :key="idx"
                      ) {{ food }}
                    div(class="")
                      p.mb-0 Scade tra:
                      p.font-weight-bold.mb-2 {{ getExpirationDays(donation) }} giorni
                    //- div 
                    //-   p(class="mb-0") Orari disponibili per il ritiro:
                    //-   p(class="font-weight-bold") 12/12/2012 
                    //-     span(class="font-weight-normal") Scade tra 12 giorni
                    div(class="")
                      p.mb-0 Luogo ritiro:
                      p.font-weight-bold {{ donation.address.street + ' ' + donation.address.civicNumber + ', ' + donation.address.city }}
                  b-col(cols="auto")
                    .mb-2
                      p.mb-0 Stato donazione:
                      h5
                        b-badge(
                          v-if="donation.status == 'waiting'",
                          variant="warning"
                        ) In attesa di valutazione
                        b-badge(
                          v-if="donation.status == 'selected'",
                          variant="success"
                        ) Prenotato per il ritiro
                        b-badge(
                          v-if="donation.status == 'withdrawn'",
                          variant="secondary"
                        ) Ritirato
                    .mb-2(v-if="hasUnreadMessages(donation._id)")
                      a(href="#") Hai {{ unreadMessagesCount(donation._id) }} messaggi non letti
              b-button.b-card-footer-button(
                block,
                @click="inspectDonation(donation)"
              ) Mostra
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import donationApi from "../api/donation";

import { Donation } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationsVolunteerList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
      donationsBackup: new Array<Donation>(),
      orderByMode: "unread_messages",
    };
  },
  computed: {
    groupedDonations() {
      const groupedDonations = new Array<{
        date: string;
        donations: Donation[];
      }>();
      for (const donation of this.donationsBackup) {
        const don = groupedDonations.find(
          (d) => d.date == donation.pickUp.date
        );
        if (don) {
          don.donations.push(donation);
        } else {
          groupedDonations.push({
            date: donation.pickUp.date,
            donations: [donation],
          });
        }
      }
      return groupedDonations;
    },
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      donationApi
        .filterPickedDonations(this.$store.state.session.userData._id)
        .then((r: AxiosResponse): void => {
          this.donations = r.data as Donation[];
          this.donationsBackup = this.donations;
          this.orderBy(this.orderByMode);
        })
        .catch((e: AxiosError): void => console.log(e));

      // api.donationsMessagesCounts(this.$store.state.session.userId,this.$store.getters.getSessionHeader).then((r:any) => {
      // });
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    pickUpDateComparer(a, b) {
      return new Date(a.pickUp.date) < new Date(b.pickUp.date) ? -1 : 1;
    },
    unreadMessagesComparer(a, b) {
      return this.unreadMessagesCount(a._id) < this.unreadMessagesCount(b._id)
        ? -1
        : 1;
    },
    orderBy(mode: string) {
      this.orderByMode = mode;
      switch (mode) {
        case "pickUp_date":
          break;
        case "unread_messages":
          this.donations = this.donations.sort(this.unreadMessagesComparer);
          break;
        default:
          null;
      }
    },
    getExpirationDays(donation: Donation) {
      return moment(donation.expirationDate).diff(moment.now(), "days");
    },
    formatDonation(donation: Donation) {
      return moment(donation.pickUp.date).locale("it").format("LL");
    },
    inspectDonation(donation: Donation) {
      this.$router.push({
        name: "ManagerDonationsInspect",
        params: { donation: JSON.stringify(donation) },
      });
    },
    hasUnreadMessages(donationId: string): boolean {
      return (
        this.$store.state.socketio.unreadMessages.findIndex(
          (e) => e._id == donationId
        ) != -1
      );
    },
    unreadMessagesCount(donationId: string): number {
      if (this.hasUnreadMessages(donationId))
        return this.$store.state.socketio.unreadMessages.find(
          (e) => e._id == donationId
        ).count;
      return 0;
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.b-card-footer-button {
  background-color: $color3;

  border: 0px;

  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.my-button-selected {
  background-color: $color1;
  border-color: $color1;
}
</style>
