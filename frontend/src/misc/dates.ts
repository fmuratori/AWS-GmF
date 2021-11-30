import moment from "moment";

const today = moment();

export default {
  formatDate(date: string): string {
    return moment(date).format("DD-MM-YYYY");
  },

  formatDatetime(date: string): string {
    return moment(date).calendar();
  },

  daysTillDate(date: string): number {
    return moment(date).diff(moment.now(), "days");
  },

  isPastDate(date: string): boolean {
    return today.diff(date) > 0;
  },
  isPresentDate(date: string): boolean {
    return today.diff(date) == 0;
  },
  isFutureDate(date: string): boolean {
    return today.diff(date) < 0;
  },
};
