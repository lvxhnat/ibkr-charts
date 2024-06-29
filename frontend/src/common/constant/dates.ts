const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (date: Date | string): string => {
  var d = new Date(date),
    month = "" + monthNames[d.getMonth()].slice(0, 3),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hours = d.getHours().toString(),
    mins = d.getMinutes().toString();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hours.length < 2) hours = "0" + hours;
  if (mins.length < 2) mins = "0" + mins;

  return `${day} ${month} ${year} ${hours}:${mins}`;
};
