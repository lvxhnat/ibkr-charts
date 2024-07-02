import * as React from "react";
import * as d3 from "d3";
import { ChartProps } from "../Chart";
import { useChartStore } from "../../../store/charts";
import { styling } from "../constants";

export interface YAxisProps extends Omit<ChartProps, "children"> {}

export default function YAxis(props: YAxisProps) {
  const ref = React.useRef<SVGGElement>(null);
  const chart = useChartStore((state) => state.charts[props.id]);
  const { margin, yScale } = chart.comps;

  React.useEffect(() => {
    if (!ref.current || !yScale) return;
    const numTicks = 10;
    const yAxis = d3.axisLeft(yScale).ticks(numTicks);

    d3.select(ref.current)
      .call(yAxis)
      .style("color", styling.yAxisColor)
      .style("stroke", styling.yAxisColor)
      .style("stroke-width", "0.2px")
      .style("font-size", styling.yAxisFontSize)
      .attr("transform", `translate(${margin.l}, 0)`);
  }, [yScale]);

  return <g ref={ref} id={`${props.id}-yAxis`} />;
}
