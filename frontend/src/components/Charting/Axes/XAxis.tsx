import * as d3 from "d3";
import * as React from "react";
import { ChartProps } from "../Chart";
import { useChartStore } from "../../../store/charts";
import { styling } from "../constants";

export interface XAxisProps extends Omit<ChartProps, "children"> {}

const getDateFormat = (extentX: string[]): ((date: Date) => string) => {
  const date1 = new Date(extentX[0]);
  const date2 = new Date(extentX[10]);
  if (date1 && date2) {
    const diff = date2.getTime() - date1.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneMonth = 30 * oneDay;

    if (diff < oneDay) {
      return (value) => {
        return d3.timeFormat("%H:%M:%S")(new Date(value));
      };
    } else if (diff < oneMonth) {
      return (value) => d3.timeFormat("%b %d")(new Date(value));
    } else {
      return (value) => d3.timeFormat("%Y-%m-%d")(new Date(value));
    }
  }
  return d3.timeFormat("%Y-%m-%d"); // Default format
};

export default function XAxis(props: XAxisProps) {
  const ref = React.useRef<SVGGElement>(null);
  const chart = useChartStore((state) => state.charts[props.id]);
  const { margin, height, xScale } = chart.comps;

  React.useEffect(() => {
    if (!ref.current || !xScale) return;

    const domain = xScale.domain();
    const dateFormat = getDateFormat(domain);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat(dateFormat as any)
      .tickValues(
        xScale.domain().filter(function (d, i) {
          const jumps = Math.round(xScale.domain().length / 10);
          return !(i % jumps);
        })
      );
    d3.select(ref.current)
      .call(xAxis)
      .style("stroke-width", "0.2px")
      .attr("transform", `translate(0, ${height - margin.b})`)
      .style("color", styling.xAxisColor)
      .style("font-size", styling.xAxisFontSize);
  }, [xScale]);

  return <g ref={ref} id={`${props.id}-xAxis`} />;
}
