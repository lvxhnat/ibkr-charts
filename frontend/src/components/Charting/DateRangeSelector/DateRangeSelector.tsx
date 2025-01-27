import * as React from "react";
import * as d3 from "d3";
import * as S from "./style";
import { ClickAwayListener, Divider, Popper, Typography } from "@mui/material";
import { IntervalTypes } from "../types";

export type PeriodChoices = "YTD" | "1Y" | "2Y" | "5Y" | "10Y" | string;

const dateConversion = {
  // "1 secs": "1s",
  // "5 secs": "5s",
  "10 secs": "10s",
  "15 secs": "15s",
  "30 secs": "30s",
  "1 min": "1m",
  "2 mins": "2m",
  "5 mins": "5m",
  "15 mins": "15m",
  "30 mins": "30m",
  "1 hour": "1h",
  "2 hours": "2h",
  "4 hours": "4h",
  "1 day": "D",
  "1 week": "W",
  "1 month": "M",
};

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
  interval: IntervalTypes;
  setInterval: (interval: IntervalTypes) => void;
  handleClick: (int?: IntervalTypes) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // Anchor for Popper

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelection = (interval: IntervalTypes) => {
    props.setInterval(interval);
    props.handleClick(interval);
    // With new data, indicators are now changed, we should update them
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <S.DateRangeWrapper id={props.id}>
      <S.DateRangeSelectionBox disableRipple onClick={handleClick}>
        <Typography variant="subtitle2">
          {dateConversion[props.interval as keyof typeof dateConversion]}
        </Typography>
      </S.DateRangeSelectionBox>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleMenuClose}>
          <S.StyledMenuList>
            <Typography variant="subtitle2" sx={{ padding: 1 }}>
              SECONDS
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 secs")}>
              <Typography variant="subtitle2">1 second</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("5 secs")}>
              <Typography variant="subtitle2">5 seconds</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("10 secs")}>
              <Typography variant="subtitle2">10 seconds</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("15 secs")}>
              <Typography variant="subtitle2">15 seconds</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("30 secs")}>
              <Typography variant="subtitle2">30 seconds</Typography>
            </S.StyledMenuItem>
            <Typography variant="subtitle2" sx={{ padding: 1 }}>
              MINUTES
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 min")}>
              <Typography variant="subtitle2">1 minute</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("2 mins")}>
              <Typography variant="subtitle2">2 minutes</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("5 mins")}>
              <Typography variant="subtitle2">5 minutes</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("15 mins")}>
              <Typography variant="subtitle2">15 minutes</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("30 mins")}>
              <Typography variant="subtitle2">30 minutes</Typography>
            </S.StyledMenuItem>
            <Typography variant="subtitle2" sx={{ padding: 1 }}>
              HOURS
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 hour")}>
              <Typography variant="subtitle2">1 Hour</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("2 hours")}>
              <Typography variant="subtitle2">2 Hours</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("4 hours")}>
              <Typography variant="subtitle2">4 Hours</Typography>
            </S.StyledMenuItem>
            <Typography variant="subtitle2" sx={{ padding: 1 }}>
              DAYS
            </Typography>
            <Divider />
            <S.StyledMenuItem onClick={() => handleSelection("1 day")}>
              <Typography variant="subtitle2">1 Day</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("1 week")}>
              <Typography variant="subtitle2">1 Week</Typography>
            </S.StyledMenuItem>
            <S.StyledMenuItem onClick={() => handleSelection("1 month")}>
              <Typography variant="subtitle2">1 Month</Typography>
            </S.StyledMenuItem>
          </S.StyledMenuList>
        </ClickAwayListener>
      </Popper>
    </S.DateRangeWrapper>
  );
}
