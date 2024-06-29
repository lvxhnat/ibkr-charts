import { useState, useEffect } from "react";

export function numberWithCommas(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const isArray = function (a: any) {
  return !!a && a.constructor === Array;
};
/**
 * Create a hexadecimal colour based on a string
 * @param str
 * @returns
 */
export const stringToColour = (str: string) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

export const capitalizeString = (colName: string) =>
  colName
    .toLowerCase()
    .split(" ")
    .map((token: string) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export function getArrMinMax(
  arr: { [other: string]: any }[],
  lowKey: string,
  highKey: string
) {
  let min = arr[0][lowKey];
  let max = arr[0][highKey];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i][lowKey] < min) {
      min = arr[i][lowKey];
    }
    if (arr[i][highKey] > max) {
      max = arr[i][highKey];
    }
  }

  return [min, max];
}
