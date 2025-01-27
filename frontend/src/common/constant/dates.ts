import { HistoricalData } from "../../components/Charting/types";

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

export const getLastTradingDayNotToday = (data: HistoricalData[]): HistoricalData | null => {
  const formattedDate = new Date().toLocaleDateString("fr-CA", {timeZone: "America/New_York"});
  const filteredData = data
    .filter((item) => item.date !== formattedDate) // Exclude today's date
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date (most recent first)
  return filteredData.length > 0 ? filteredData[0] : null;
};