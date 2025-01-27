import * as React from "react";
import { ChartProps } from "../Chart";
import { styling } from "../constants";
import { useChartMouseStore, useChartStore } from "../../../store/charts";

export interface CrosshairProps extends Omit<ChartProps, "children"> {}

export default function Crosshair(props: CrosshairProps) {
  const mousePosition = useChartMouseStore(
    (state) => state.mousePosition[props.id]
  );
  const chart = useChartStore((state) => state.charts[props.id]);
  const { width, height, margin } = chart.comps;

  return (
    <g className="react-stockcharts-crosshair">
      {mousePosition ? (
        <React.Fragment>
          <line
            id={`${props.id}-xCrossHair`}
            stroke={styling.crosshairColor}
            strokeOpacity={styling.crosshairOpacity}
            strokeDasharray={styling.crosshairDasharray}
            x1={margin.l}
            y1={mousePosition[1]}
            x2={width}
            y2={mousePosition[1]}
          />
          <line
            id={`${props.id}-yCrossHair`}
            stroke={styling.crosshairColor}
            strokeOpacity={styling.crosshairOpacity}
            strokeDasharray={styling.crosshairDasharray}
            x1={mousePosition[0]}
            y1={margin.t}
            x2={mousePosition[0]}
            y2={height - margin.b}
          />
        </React.Fragment>
      ) : null}
    </g>
  );
}
