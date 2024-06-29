export default function getDecimalPlaces(entry: any, nextEntry: any): any {
  let decimalPlaces: number = 2;
  if (
    entry &&
    nextEntry &&
    typeof entry === "number" &&
    typeof nextEntry === "number"
  ) {
    if (Math.abs(entry - nextEntry) < 0.1) decimalPlaces = 5;
  }
  if (typeof entry === "number") return entry.toFixed(decimalPlaces);
  else return entry;
}
