import moment from "moment";

const today = moment();

const tomorrow = today.add(1, "days");

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
    return today.diff(date) > 0;
  },
  isPresentDate(date: Date): boolean {
    return today.diff(date) == 0;
  },
  isFutureDate(date: Date): boolean {
    return today.diff(date) < 0;
  },

  getNearestDate(dates: Date[]): string {
    const today = moment();

    let nearestDate;
    dates.forEach((date) => {
      const diff = moment(date).diff(today, "days");
      if (diff > 0) {
        if (nearestDate && moment(date).diff(nearestDate, "days") < 0) {
          nearestDate = moment(date);
        } else {
          nearestDate = moment(date);
        }
      }
    });
    return nearestDate;
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
