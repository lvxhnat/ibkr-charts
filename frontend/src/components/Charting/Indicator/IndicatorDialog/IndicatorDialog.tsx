/**
 * List all the available technical indicators that can be added to the chart.
 */
import * as React from "react";

import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { TbMathIntegralX } from "react-icons/tb";
import { Button, Grid, Table, TableBody } from "@mui/material";
import { BootstrapDialog, BootstrapDialogTitle } from "./Dialog";
import { StyledTableCell, StyledTableRow } from "./BaseTable";
import {
  IndicatorParameterType,
  IndicatorParameters,
} from "../../../../common/indicators";
import { ChartProps } from "../../Chart";
import { useChartStore } from "../../../../store/charts";
import { v4 as uuid } from "uuid";
import { OHLC, TimeSeries } from "../../types";
import { stringToColour } from "../../../../common/helper/general";
import { typographyTheme } from "../../../../common/theme/typography";

interface IndicatorProps extends Omit<ChartProps, "children"> {}

export default function IndicatorDialog(props: IndicatorProps) {
  const [open, setOpen] = React.useState(false);
  const [chart, setIndicators] = useChartStore((state) => [
    state.charts[props.id],
    state.setIndicators,
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleIndicatorSelect = (
    indicatorId: string,
    indicator: IndicatorParameterType
  ) => {
    let d;
    if ("close" in chart.data[0])
      d = (chart.data as OHLC[]).map((d) => d.close);
    else d = (chart.data as TimeSeries[]).map((d) => d.value);
    const indicatorValue: number[][] = indicator.func(d, indicator.params);
    setIndicators(props.id, {
      [indicatorId]: {
        ...indicator,
        data: indicatorValue,
        color: stringToColour(indicatorId),
      },
    });
  };

  return (
    <React.Fragment>
      <Button
        size="small"
        variant="contained"
        disableFocusRipple
        onClick={handleClickOpen}
        style={{
          padding: "1.6vh 1vw",
          height: 0,
        }}
        startIcon={
          <TbMathIntegralX size={typographyTheme.subtitle1.fontSize} />
        }
      >
        <Typography variant="subtitle1">Indicators</Typography>
      </Button>
      <BootstrapDialog
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle handleClose={handleClose}>
          <TbMathIntegralX fontSize="inherit" />
          Technical Indicators
        </BootstrapDialogTitle>
        <DialogContent dividers style={{ padding: 0, minWidth: "500px" }}>
          <Grid container>
            <Table>
              <TableBody>
                {Object.keys(IndicatorParameters).map((indicatorId: string) => {
                  const indicator =
                    IndicatorParameters[
                      indicatorId as keyof typeof IndicatorParameters
                    ];
                  return (
                    <StyledTableRow
                      key={`${props.id}-${indicatorId}`}
                      onClick={() =>
                        handleIndicatorSelect(
                          `${indicatorId}-${uuid()}`,
                          indicator
                        )
                      }
                    >
                      <StyledTableCell
                        isHeader
                        width="100%"
                        sx={{ paddingLeft: 2 }}
                      >
                        <Typography
                          align="left"
                          variant="subtitle1"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          {indicator.icon}
                          {indicator.name}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
