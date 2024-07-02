import * as React from "react";
import * as d3 from "d3";
import { ChartProps } from "../Chart";
import { ColorsEnum } from "../../../common/theme";
import { useChartStore } from "../../../store/charts";

export interface LineProps extends Omit<ChartProps, "children"> {
  color: string;
  indicatorId: string;
  data: number[];
}

export default function Line(props: LineProps) {
  const ref = React.useRef<SVGGElement>(null);
  const charts = useChartStore((state) => state.charts[props.id]);
  const { xScale, yScale } = charts.comps;
  // The indicator data series
  const data = charts.data.map((d, i) => ({
    date: d.date as string,
    value: props.data[i],
  }));

  React.useEffect(() => {
    if (!data) return;

    const svg = d3.select(ref.current);
    const legendGroup = svg.select("path");
    if (!legendGroup.empty()) {
      legendGroup.remove();
    }

    const line = d3
      .line<{ date: string; value: number }>()
      .x(function (_, i) {
        return xScale!(data[i].date)!;
      })
      .y(function (_, i) {
        return yScale!(data[i].value);
      })
      .defined((_, i) => {
        return !!data[i].value;
      });

    const path = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", props.color)
      .attr("stroke-width", 1)
      .attr("d", line(data));

    // Get the total length of the line
    const totalLength = path.node()?.getTotalLength();
    if (totalLength)
      path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
  }, [data, xScale, yScale]);

  return <g id={`${props.id}-${props.indicatorId}-line`} ref={ref} />;
}
