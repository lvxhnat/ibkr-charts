import { Indicators } from "../../../../store/charts";
import { Data } from "../../types";

export const recalcIndicators = (
  data: Data,
  indicators: Indicators,
  indicatorId?: string
): Indicators => {
  const newIndicators = { ...indicators };
  const timeSeries = data.map((entry) =>
    "close" in entry ? entry.close : entry.value
  );
  if (indicatorId) {
    const indicator = indicators[indicatorId];
    newIndicators[indicatorId].data = indicator.func(
      timeSeries,
      indicator.params
    );
  } else {
    Object.keys(indicators).map((indId: string) => {
      const indicator = indicators[indId];
      newIndicators[indId].data = indicator.func(timeSeries, indicator.params);
    });
  }
  return newIndicators;
};
