import * as d3 from "d3";
import * as React from "react";
import { v4 as uuid } from "uuid";
import { IndicatorObject, useChartStore } from "../../../../store/charts";
import { ChartProps } from "../../Chart";
import { YAxis } from "../../Axes";
import Line from "../../Series/Line";
import { ColorsEnum } from "../../../../common/theme";

interface IndicatorSubseriesProps extends Omit<ChartProps, "children"> {}

interface yScaleType {
  scale: d3.ScaleLinear<number, number, never>;
  shortId: string;
}

export default function IndicatorSubseries(props: IndicatorSubseriesProps) {
  const [charts, setComponents] = useChartStore((state) => [
    state.charts[props.id],
    state.setComponents,
  ]);
  const { comps, indicators } = charts;
  const heightProportion = 0.2;
  const noCharts = Object.keys(indicators).length;
  const [yScales, setYScales] = React.useState<yScaleType[]>([]);

  React.useEffect(() => {
    const yArr: yScaleType[] = [];
    Object.keys(indicators).forEach((shortId: string) => {
      const indicatorParams: IndicatorObject =
        indicators[shortId as keyof typeof indicators];
      if (indicatorParams.chartType === "subchart") {
        yArr.push({
          scale: d3
            .scaleLinear()
            .range([
              comps.height * heightProportion - comps.margin.b + comps.margin.t,
              0,
            ])
            .domain([0, 100]),
          shortId: shortId,
        });
      }
    });
    if (yArr.length !== 0) {
      const mainYScale = d3
        .scaleLinear()
        .range([comps.height * (1 - heightProportion), 0])
        .domain(comps.yScale!.domain());
      setComponents(props.id, { ...comps, yScale: mainYScale });
      setYScales(yArr);
    }
  }, [indicators]);

  return (
    <React.Fragment>
      {/* {yScales.length !== 0 ? <YAxis id={props.id} yScale={yScale}/> : <></>} */}
      {yScales.map((entry, i) => {
        return (
          <React.Fragment>
            <YAxis
              id={props.id}
              numTicks={4}
              chartId={`${props.id}-${i}`}
              yScale={entry.scale}
              transform={`translate(${comps.margin.l}, ${
                comps.height * (1 - heightProportion * (i + 1))
              })`}
            />
            <Line
              id={props.id}
              yScale={entry.scale}
              data={indicators[entry.shortId].data[0]}
              color={ColorsEnum.white}
              indicatorId={uuid()}
              transform={`translate(0, ${
                comps.height * (1 - heightProportion * (i + 1))
              })`}
            />
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}
