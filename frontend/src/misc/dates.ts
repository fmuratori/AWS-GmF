import moment from "moment";

moment;

export default {
  formatDate(date: string): string {
    return moment(date).format("DD-MM-YYYY");
  },

  formatDatetime(date) {
    return moment(date).calendar();
  },

  daysTillDate(date) {
    return moment(date).diff(moment.now(), "days");
  },
};
