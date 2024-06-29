import * as S from "./style";
import moment from "moment";
import * as React from "react";
import {
  IndicatorObject,
  useChartMouseStore,
  useChartStore,
} from "../../../store/charts";
import { ChartProps } from "../Chart";
import { OHLC } from "../types";
import { ColorsEnum } from "../../../common/theme";
import { Typography } from "@mui/material";

export interface LegendProps extends Omit<ChartProps, "children"> {}

export default function Legend(props: LegendProps) {
  const chart = useChartStore((state) => state.charts[props.id]);
  const mousePos = useChartMouseStore((state) => state.mousePosition[props.id]);
  const [index, setIndex] = React.useState<number>(0);
  const [meta, setMeta] = React.useState<string[]>([]);
  const [colors, setColors] = React.useState<string[]>([]);
  const { data, indicators, comps } = chart;
  const { margin, xScale } = comps;

  React.useEffect(() => {
    if (mousePos) {
      const indexDec = (mousePos[0] - margin.l) / xScale!.step(); // Decimalised
      const index = Math.floor(indexDec) - 1;
      if (index) setIndex(index);
    }
  }, [mousePos]);

  React.useEffect(() => {
    const indicatorColors: string[] = [ColorsEnum.white];
    // Initialise the main data series legend.
    let m_ = "";
    if (data[index]) {
      m_ = `Date: ${moment(data[index].date).format("DD MMM YYYY HH:MM")}`;
      if ("close" in data[index]) {
        const entry = data[index] as OHLC;
        m_ = `${m_} — Open: $${entry.open} High: $${entry.high} Low: $${entry.low} Close: $${entry.close}`;
      } else {
        m_ = `${m_} Value: ${data[index].value}`;
      }
    }

    const indicatorValues_ = Object.keys(indicators).map((shortId: string) => {
      const indicator: IndicatorObject =
        indicators[shortId as keyof typeof indicators];
      const v = indicator.data.map((d, i) => {
        let appendItem = "";
        if (indicator.data.length > 1) appendItem = `-${i}`;
        let value = d[index];
        if (value) return `Value${appendItem}: $${value.toFixed(2)}`;
        else return `Value${appendItem}: `;
      });
      indicatorColors.push(indicator.color);
      return `${indicator.shortName}(${Object.values(indicator.params).join(
        ", "
      )}) ${v}`;
    });

    setColors(indicatorColors);
    setMeta([m_, ...indicatorValues_]);
  }, [index]);

  return (
    <S.LegendContainer id={`${props.id}-legend`}>
      {meta.map((tag, i) => (
        <S.RowWrapper>
          <S.Circle color={colors[i]} />{" "}
          <Typography variant="subtitle1" color="white">
            {tag}
          </Typography>
        </S.RowWrapper>
      ))}
    </S.LegendContainer>
  );
}
