import * as d3 from "d3";
import * as React from "react";
import { Grid, Typography } from "@mui/material";

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
import { HistoricalData, IntervalMapping, IntervalTypes } from "./types";
import { getArrMinMax } from "../../common/helper/general";
import { recalcIndicators } from "./Indicator/IndicatorDialog/utils";
import { Ticker } from "./Search/requests";

interface ChartingProps {
  id: string;
  isSmall: boolean;
}

export default function Charting(props: ChartingProps) {
  const [conId, setConId] = React.useState<number>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [res, setRes] = React.useState<HistoricalData[]>([]);
  const [chart, setIndicators, setComponents, setData] = useChartStore(
    (state) => [
      state.charts[props.id],
      state.setIndicators,
      state.setComponents,
      state.setData,
    ]
  );
  const [selectedTicker, setSelectedTicker] = React.useState<Ticker>();
  const [interval, setInterval] = React.useState<IntervalTypes>("1 day");
  const [width, setWidth] = React.useState(window.innerWidth * 0.8); // 80% of screen width
  const [height, setHeight] = React.useState(window.innerHeight * 0.75); // 60% of screen height

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth * 0.8);
      setHeight(window.innerHeight * 0.6);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set default values
  const margin = { t: 5, b: 30, l: 40, r: 10 };

  React.useEffect(() => {
    if (chart && chart.indicators) {
      const indicator = recalcIndicators(res, chart.indicators);
      setIndicators(props.id, indicator);
    }
  }, [res]);

  React.useEffect(() => {
    if (conId && interval) {
      setLoading(true);
      handleClick(conId, interval); // Initial call
      const refreshInterval: number = window.setInterval(() => {
        handleClick(conId, interval);
      }, Math.max(IntervalMapping[interval] * 1000, 5 * 1000)); // Minimum 5 seconds
      return () => window.clearInterval(refreshInterval);
    }
  }, [conId, interval]);

  const handleClick = (conId: number, customInterval?: IntervalTypes) => {
    getHistoricalData(conId, { interval: customInterval ?? interval })
      .then((res) => {
        const resData = res.data;
        if (!resData || resData.length === 0) return;
        setData(props.id, resData);
        setRes(resData);
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
      )
      .finally(() => setLoading(false));
  };

  return (
    <Grid style={{ height: "100%", width: "100%" }}>
      <Grid container display="flex" alignItems="center">
        <Grid item xs={4} sx={{ paddingRight: "5px" }}>
          <Search
            id={`${props.id}-search`}
            key={`${props.id}-search`}
            onClick={(ticker) => {
              const conId = ticker.conid;
              setSelectedTicker(ticker);
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
              <LivePrice
                isSmall={props.isSmall}
                id={props.id}
                ticker={selectedTicker!}
              />
            </React.Fragment>
          ) : null}
        </Grid>
      </Grid>
      <Grid sx={{ padding: 0 }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px"
            }}
          >
            <Typography variant="body2">Loading Chart...</Typography>
          </div>
        ) : !!conId && res.length !== 0 ? (
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
