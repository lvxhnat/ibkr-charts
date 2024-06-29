import * as d3 from "d3";
import moment from "moment";
import * as React from "react";
import { ChartProps } from "../Chart";
import { useChartStore } from "../../../store/charts";
import { styling } from "../constants";

export interface XAxisProps extends Omit<ChartProps, "children"> {}

export default function XAxis(props: XAxisProps) {

  const ref = React.useRef<SVGGElement>(null);
  const chart = useChartStore((state) => state.charts[props.id]);
  const { margin, height, xScale} = chart.comps

  React.useEffect(() => {
    
    if (!ref.current || !xScale) return;
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((value) => moment(new Date(value)).format("DD MMM YY"))
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

  return (
    <g
      ref={ref}
      id={`${props.id}-xAxis`}
    />
  );
};


