import * as React from "react";
import * as d3 from "d3";
import * as S from "./style";
import { ClickAwayListener, Divider, Popper, Typography } from "@mui/material";
import { ColorsEnum } from "../../../common/theme";
import { IntervalTypes } from "../types";
import { useChartStore } from "../../../store/charts";
import { recalculateIndicators } from "../Indicator/IndicatorDialog/utils";

export type PeriodChoices = "YTD" | "1Y" | "2Y" | "5Y" | "10Y" | string;

export const processChoiceToDate = (periodChoice: PeriodChoices): Date => {
  let currentDate = new Date();
  if (periodChoice === "YTD") return new Date(currentDate.getFullYear(), 0, 1);
  else if (periodChoice !== "Custom") {
    let deductDate = 0;
    if (periodChoice === "1Y") deductDate = 1;
    else if (periodChoice === "2Y") deductDate = 2;
    else if (periodChoice === "5Y") deductDate = 5;
    else if (periodChoice === "10Y") deductDate = 10;
    currentDate.setFullYear(new Date().getFullYear() - deductDate);
    return currentDate;
  } else return d3.timeParse("%Y-%m-%d")(periodChoice)!;
};

export default function DateRangeSelector(props: {
  id: string;
  interval: IntervalTypes,
  setInterval: (interval: IntervalTypes) => void;
  handleClick: (int?: IntervalTypes) => void;
}) {
  const [chart, setIndicators] = useChartStore((state) => [state.charts[props.id], state.setIndicators])
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // Anchor for Popper


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelection = (interval: IntervalTypes) => {
    props.setInterval(interval)
    props.handleClick(interval);
    // With new data, indicators are now changed, we should update them
    setIndicators(props.id, recalculateIndicators(chart.data, chart.indicators))
    handleMenuClose()
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <S.DateRangeWrapper id={props.id}>
      <S.DateRangeSelectionBox
        onClick={handleClick}
      >
        <Typography variant="subtitle1">{props.interval}</Typography>
      </S.DateRangeSelectionBox>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleMenuClose}>
          <S.StyledMenuList>
            <Typography variant="subtitle1" sx={{ padding: 1 }}>
              SECONDS
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 secs")}>
              <Typography variant="subtitle1">1 second</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("5 secs")}>
              <Typography variant="subtitle1">5 seconds</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("10 secs")}>
              <Typography variant="subtitle1">10 seconds</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("15 secs")}>
              <Typography variant="subtitle1">15 seconds</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("30 secs")}>
              <Typography variant="subtitle1">30 seconds</Typography>
            </S.StyledMenuItem>
            <Typography variant="subtitle1" sx={{ padding: 1 }}>
              MINUTES
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 min")}>
              <Typography variant="subtitle1">1 minute</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("2 mins")}>
              <Typography variant="subtitle1">2 minutes</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("5 mins")}>
              <Typography variant="subtitle1">5 minutes</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("15 mins")}>
              <Typography variant="subtitle1">15 minutes</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("30 mins")}>
              <Typography variant="subtitle1">30 minutes</Typography>
            </S.StyledMenuItem>
            <Typography variant="subtitle1" sx={{ padding: 1 }}>
              HOURS
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 hour")}>
              <Typography variant="subtitle1">1 Hour</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("2 hours")}>
              <Typography variant="subtitle1">2 Hours</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("4 hours")}>
              <Typography variant="subtitle1">4 Hours</Typography>
            </S.StyledMenuItem>
            <Typography variant="subtitle1" sx={{ padding: 1 }}>
              DAYS
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 day")}>
              <Typography variant="subtitle1">1 Day</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("1 week")}>
              <Typography variant="subtitle1">1 Week</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("1 month")}>
              <Typography variant="subtitle1">1 Month</Typography>
            </S.StyledMenuItem>
          </S.StyledMenuList>
        </ClickAwayListener>
      </Popper>
    </S.DateRangeWrapper>
  );
}
