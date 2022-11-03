export class Time {
  date: Date;
  constructor(date?: string | Date) {
    if (date === undefined) {
      this.date = new Date();
    } else if (typeof date === "string") {
      this.date = new Date(date);
    } else {
      this.date = date;
    }
  }
  format(pattern = "YYYY-MM-DD") {
    // 目前支持的格式有 YYYY MM DD HH mm ss SSS
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const hour = this.date.getHours();
    const minute = this.date.getMinutes();
    const second = this.date.getSeconds();
    const msecond = this.date.getMilliseconds();
    return pattern
      .replace(/YYYY/g, year.toString())
      .replace(/MM/, month.toString().padStart(2, "0"))
      .replace(/DD/, day.toString().padStart(2, "0"))
      .replace(/HH/, hour.toString().padStart(2, "0"))
      .replace(/mm/, minute.toString().padStart(2, "0"))
      .replace(/ss/, second.toString().padStart(2, "0"))
      .replace(/SSS/, msecond.toString().padStart(3, "0"));
  }
  firstDayOfMonth() {
    return new Time(
      new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0)
    );
  }
  firstDayOfYear() {
    return new Time(new Date(this.date.getFullYear(), 0, 1, 0, 0, 0));
  }
  lastDayOfMonth() {
    return new Time(
      new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0)
    );
  }
  lastDayOfYear() {
    return new Time(new Date(this.date.getFullYear() + 1, 0, 0, 0, 0, 0));
  }
  getRaw() {
    return this.date;
  }
  add(
    amount: number,
    unit:
      | "year"
      | "month"
      | "day"
      | "hour"
      | "minute"
      | "second"
      | "millisecond"
  ) {
    const date = new Date(this.date.getTime());
    switch (unit) {
      case "year":
        date.setFullYear(date.getFullYear() + amount);
        break;
      case "month":
        const d = date.getDate(); //假设是1.31号，存在d里
        date.setDate(1); //把1.31变成1.1号
        date.setMonth(date.getMonth() + amount); //对1.1进行加1操作，变成2.1号
        const d2 = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          0,
          0,
          0
        ).getDate(); //得到当前选择年份和当前月份的下一个月，然后查看下个月的天数是多少
        date.setDate(Math.min(d, d2)); //对比本月和下个月的天数，更新小的那个
        break;
      case "day":
        date.setFullYear(date.getFullYear() + amount);
        break;
      case "hour":
        date.setFullYear(date.getFullYear() + amount);
        break;
      case "minute":
        date.setFullYear(date.getFullYear() + amount);
        break;
      case "second":
        date.setFullYear(date.getFullYear() + amount);
        break;
      case "millisecond":
        date.setFullYear(date.getFullYear() + amount);
        break;
    }
    return new Time(date);
  }
}
