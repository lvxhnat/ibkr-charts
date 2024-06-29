import * as React from "react";
import * as d3 from "d3";

import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { ColorsEnum } from "../../../common/theme";

export const DateRangeWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const DateRangeSelectionBox = styled("div")<{ selected?: boolean }>(
  ({ theme }) => ({
    zIndex: 10,
    height: 25,
    padding: `1px 10px`,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: ColorsEnum.white,
    border: `1px solid ${ColorsEnum.warmgray1}`,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: ColorsEnum.warmgray2,
    },
  })
);

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
  onClick?: (date: Date) => void;
}) {
  const [period, setPeriod] = React.useState<PeriodChoices>("YTD");
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const id = (event.currentTarget as any).id;
    if (id === period) setPeriod("YTD");
    else setPeriod(id);
    if (props.onClick) {
      props.onClick(processChoiceToDate(id));
    }
  };

  return (
    <DateRangeWrapper>
      <DateRangeSelectionBox
        id="YTD"
        style={{
          backgroundColor:
            period === "YTD" ? ColorsEnum.darkGrey : ColorsEnum.warmgray2,
        }}
        onClick={handleClick}
      >
        <Typography variant="subtitle2">YTD</Typography>
      </DateRangeSelectionBox>
    </DateRangeWrapper>
  );
}
