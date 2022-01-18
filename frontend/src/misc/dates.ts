import moment from "moment";

const today = moment();

const tomorrow = moment().add(1, "days");

export default {
  today,
  tomorrow,

  formatDate(date: Date): string {
    return moment(date).format("DD-MM-YYYY");
  },

  formatDatetime(date: Date): string {
    return moment(date).calendar();
  },

  daysTillDate(date: Date): number {
    return moment(date).diff(moment.now(), "days");
  },

  isPastDate(date: Date): boolean {
    return moment(date).isBefore(today, "days");
  },
  isPresentDate(date: Date): boolean {
    return today.diff(date, "days") == 0;
  },
  isFutureDate(date: Date): boolean {
    return moment(date).isAfter(today, "days");
  },

  getNearestDate(dates: Date[]): Date {
    let nearestDate = moment(dates[0]);
    let nearestDateDiff = nearestDate.diff(today, "days");
    dates.forEach((date) => {
      const diff = moment(date).diff(today, "days");
      if (diff < nearestDateDiff) {
        nearestDate = moment(date);
        nearestDateDiff = diff;
      }
    });
    return nearestDate.toDate();
  },

  getMaxDate(dates: Date[]): Date {
    return new Date(
      Math.max.apply(
        null,
        dates.map((d) => new Date(d).valueOf())
      )
    );
  },
  getMinDate(dates: Date[]): Date {
    return new Date(
      Math.min.apply(
        null,
        dates.map((d) => new Date(d).valueOf())
      )
    );
  },
};
