import * as React from "react";
import { ChartProps } from "../../Chart";
import { IndicatorObject, useChartStore } from "../../../../store/charts";
import Line from "../../Series/Line";

interface IndicatorSeriesProps extends Omit<ChartProps, "children"> {}

export default function IndicatorSeries(props: IndicatorSeriesProps) {
  const charts = useChartStore((state) => state.charts[props.id]);
  console.log(props.id, "Rerendered")
  return (
    <React.Fragment>
      {Object.keys(charts.indicators).map((shortId: string) => {
        const indicatorParams: IndicatorObject =
          charts.indicators[shortId as keyof typeof charts.indicators];
        const indicatorData = indicatorParams.data;
        return indicatorData.map((d) => {
          return (
            <Line
              color={indicatorParams.color}
              key={`${props.id}-${shortId}`}
              id={props.id}
              indicatorId={shortId}
              data={d}
            />
          );
        });
      })}
    </React.Fragment>
  );
}
