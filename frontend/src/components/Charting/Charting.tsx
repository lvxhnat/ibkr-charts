import * as d3 from "d3";
import * as React from "react";
import { Grid } from "@mui/material";

import Chart from "./Chart";
import Search from "./Search";
import MainSeries from "./Series";
import { Legend } from "./Legend";
import LivePrice from "./LivePrice";
import { Crosshair } from "./Hovers";
import { XAxis, YAxis } from "./Axes";
import { IndicatorSeries, IndicatorSubseries } from "./Indicator";
import { getHistoricalData } from "./requests";
import { useChartStore } from "../../store/charts";
import DateRangeSelector from "./DateRangeSelector";
import Indicators from "./Indicator/IndicatorDialog";
import { HistoricalData, IntervalTypes } from "./types";
import { getArrMinMax } from "../../common/helper/general";
import { recalcIndicators } from "./Indicator/IndicatorDialog/utils";

interface ChartingProps {
  id: string;
}

/**
 * References:
 * https://codepen.io/browles/pen/mPMBjw
 *
 * @param props
 * @returns
 */
export default function Charting(props: ChartingProps) {
  const [conId, setConId] = React.useState<number>();
  const [res, setRes] = React.useState<HistoricalData[]>([]);
  const [chart, setIndicators, setComponents, setData] = useChartStore(
    (state) => [
      state.charts[props.id],
      state.setIndicators,
      state.setComponents,
      state.setData,
    ]
  );
  const [interval, setInterval] = React.useState<IntervalTypes>("1 hour");
  // Set default values
  const margin = { t: 5, b: 30, l: 40, r: 10 };
  const width = 1100;
  const height = 600;

  React.useEffect(() => {
    if (chart && chart.indicators) {
      const indicator = recalcIndicators(res, chart.indicators);
      setIndicators(props.id, indicator);
    }
  }, [res]);

  const handleClick = (conId: number, customInterval?: IntervalTypes) =>
    getHistoricalData(conId, { interval: customInterval ?? interval })
      .then((res) => {
        const resData = res.data;
        if (!resData || resData.length === 0) return;
        setData(props.id, resData);
        setRes(resData);

        // Declare the axes that have to be present
        const isOHLC = "close" in resData[0];
        const [minY, maxY] = getArrMinMax(
          resData,
          isOHLC ? "low" : "value",
          isOHLC ? "high" : "value"
        );
        const extentX: string[] = resData.map((value) => value.date);
        const extentY: [number, number] = [
          Math.max(minY - (maxY - minY) * 0.2, 0),
          maxY + (maxY - minY) * 0.2,
        ];
        const xScale = d3
          .scaleBand()
          .range([margin.l, width - margin.r])
          .domain(extentX)
          .padding(1);
        const yScale = d3
          .scaleLinear()
          .range([height - margin.b, margin.t])
          .domain(extentY);

        setComponents(props.id, {
          conId: conId,
          width: width,
          height: height,
          margin: margin,
          minY: minY,
          maxY: maxY,
          extentX: extentX,
          extentY: extentY,
          xScale: xScale,
          yScale: yScale,
        });
      })
      .catch((err) =>
        console.log(`Timeout error when requesting data for contract ${conId}`)
      );

  return (
    <Grid style={{ height: "100%", width: "100%" }}>
      <Grid container display="flex" alignItems="center">
        <Grid item xs={4} sx={{ paddingRight: "5px" }}>
          <Search
            onClick={(conId) => {
              setConId(conId);
              handleClick(conId);
            }}
          />
        </Grid>
        <Grid
          item
          xs={8}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={0.5}
        >
          {conId ? (
            <React.Fragment>
              <DateRangeSelector
                id={props.id}
                interval={interval}
                setInterval={setInterval}
                handleClick={(int?: IntervalTypes) => handleClick(conId, int)}
              />
              <Indicators id={props.id} />
              <LivePrice id={props.id} conId={conId} />
            </React.Fragment>
          ) : null}
        </Grid>
      </Grid>
      <Grid sx={{ paddingTop: 0 }}>
        {!!conId && res.length !== 0 ? (
          <React.Fragment>
            <Legend id={props.id} />
            <Chart id={props.id}>
              <XAxis id={props.id} />
              <YAxis id={props.id} />
              <Crosshair id={props.id} />
              <MainSeries id={props.id} data={res} />
              <IndicatorSeries id={props.id} />
              <IndicatorSubseries id={props.id} />
            </Chart>
          </React.Fragment>
        ) : null}
      </Grid>
    </Grid>
  );
}
