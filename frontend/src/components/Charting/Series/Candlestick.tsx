import * as d3 from "d3";
import * as React from "react";
import { ChartProps } from "../Chart";
import { useChartStore } from "../../../store/charts";
import { styling } from "../constants";
import { Data, OHLC } from "../types";

export interface CandlestickProps extends Omit<ChartProps, "children"> {
    data: Data
}

export default function Candlestick(props: CandlestickProps) {

  const ref = React.useRef<SVGSVGElement>(null);
  const chart = useChartStore((state) => state.charts[props.id]);
  const { margin, width, yScale, xScale } = chart.comps;
  const data: OHLC[] = props.data as OHLC[];
  const barWidth = (0.8 * (width - margin.l - margin.r)) / data.length;
  React.useEffect(() => {

    if (!ref.current || !xScale) return;
    d3.select(ref.current).selectAll(`.${props.id}-candle`).remove();

    const g = d3
      .select(ref.current)
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("class", `${props.id}-candle`)
      .attr("transform", (d) => `translate(${xScale!(d.date)},0)`);

    g.append("line")
      .attr("y1", (d) => yScale!(d.low))
      .attr("y2", (d) => yScale!(d.high))
      .attr("stroke-width", "0.5px")
      .attr("stroke", styling.wickColor);

      g.append("rect")
      .attr("width", barWidth)
      .attr("height", (d) => Math.abs(yScale!(d.open) - yScale!(d.close)))
      .attr("x", -(barWidth / 2))
      .attr("y", (d) => Math.min(yScale!(d.open), yScale!(d.close)))
      .attr("fill", (d) => d.close > d.open ? styling.positive : styling.negative);

  }, [props.data]);

  return <g id={`${props.id}-candleStick`} ref={ref} />;
}
