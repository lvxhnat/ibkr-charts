import * as React from "react";
import * as d3 from "d3";
import { throttle } from "lodash";
import { useChartMouseStore, useChartStore } from "../../store/charts";

export interface ChartProps {
  id: string;
  children: React.ReactNode;
}

export default function Chart(props: ChartProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const charts = useChartStore((state) => state.charts[props.id]);
  const setMousePosition = useChartMouseStore(
    (state) => state.setMousePosition
  );

  const handleMouseMove = React.useCallback(
    throttle((event: MouseEvent) => {
      if (!svgRef.current) return;
      const mousePos: [number, number] = d3.pointer(event);
      setMousePosition(props.id, mousePos);
    }, 10),
    []
  );

  React.useEffect(() => {
    const legendGroup = d3.select(svgRef.current).select("svg");
    if (!legendGroup.empty()) {
      legendGroup.remove();
    }
  }, [charts.comps ? charts.comps.conId : charts.comps]);

  if (!charts) return <></>;

  const { width, height, margin } = charts.comps;

  return (
    <svg
      id={props.id}
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMin"
      className="svg-content-responsive"
    >
      <rect
        x={margin.l}
        y={margin.t}
        width={width - margin.l - margin.r}
        height={height - margin.t - margin.b}
        fill="transparent"
        onMouseMove={handleMouseMove as any}
      />
      {props.children}
    </svg>
  );
}
