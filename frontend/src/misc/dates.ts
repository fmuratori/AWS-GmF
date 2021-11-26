import moment from "moment";

moment.locale("it");

export default {
  formatDate(date: string): string {
    return moment(date).format("DD-MM-YYYY");
  },

  formatDatetime(date) {
    return moment(new Date(date)).calendar();
  },

  daysTillDate(date) {
    return moment(date).diff(moment.now(), "days");
  },
};
