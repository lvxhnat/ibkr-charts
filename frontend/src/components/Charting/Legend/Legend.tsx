import * as d3 from "d3";
import * as S from "./style";
import * as React from "react";
import {
  IndicatorObject,
  useChartMouseStore,
  useChartStore,
} from "../../../store/charts";
import { ChartProps } from "../Chart";
import { OHLC } from "../types";
import { ColorsEnum } from "../../../common/theme";
import {
  Typography,
  Popper,
  ClickAwayListener,
  DialogContent,
  Grid,
  Table,
  TableBody,
  Button,
} from "@mui/material";
import { MdOutlineMoreHoriz } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import FunctionsIcon from "@mui/icons-material/Functions";
import {
  BootstrapDialog,
  BootstrapDialogTitle,
} from "../Indicator/IndicatorDialog/Dialog";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Indicator/IndicatorDialog/BaseTable";

import { capitalizeString } from "../../../common/helper/general";
import { typographyTheme } from "../../../common/theme/typography";

export interface LegendProps extends Omit<ChartProps, "children"> {
  [others: string]: any
}

interface MetaType {
  [shortId: string]: { color: string; text: string };
}
interface StagingParams {
  indicatorId: string;
  params: {[params: string]: any}
}

export default function Legend(props: LegendProps) {
  const [chart, setIndicators, removeIndicator] = useChartStore((state) => [
    state.charts[props.id],
    state.setIndicators,
    state.removeIndicator,
  ]);
  const mousePos = useChartMouseStore((state) => state.mousePosition[props.id]);
  const [index, setIndex] = React.useState<number>(0);
  const [meta, setMeta] = React.useState<MetaType>({});
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // Anchor for Popper
  const [stagingParams, setStagingParams] = React.useState<StagingParams>({} as StagingParams); // Anchor for Popper

  const { data, indicators, comps } = chart;
  const { margin, xScale } = comps;

  React.useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleMenuClose();
      }
    };

    document.addEventListener("keydown", closeMenu);
    return () => document.removeEventListener("keydown", closeMenu);
  }, []);

  React.useEffect(() => {
    if (mousePos) {
      const indexDec = (mousePos[0] - margin.l) / xScale!.step(); // Decimalised
      const index = Math.floor(indexDec) - 1;
      if (index) setIndex(index);
    }
  }, [mousePos]);

  React.useEffect(() => {
    // Initialise the main data series legend.
    let m_ = "";
    if (data[index]) {
      let date = data[index].date;
      if (date) date = new Date(date as string)!;
      m_ = `${d3.timeFormat("%d %b %Y %H:%M:%S")(date as Date)}`;
      if ("close" in data[index]) {
        const entry = data[index] as OHLC;
        m_ = `${m_} — O: $${entry.open} H: $${entry.high} L: $${entry.low} C: $${entry.close}`;
      } else {
        m_ = `${m_} Value: ${data[index].value}`;
      }
    }
    let acc: MetaType = {};
    acc["base"] = { color: ColorsEnum.white, text: m_ };
    for (const shortId of Object.keys(indicators)) {
      // Legend for the shortIds
      const indicator: IndicatorObject =
        indicators[shortId as keyof typeof indicators];
      console.log(indicator.data, data, index)
      const v = indicator.data.map((d, i) => {
        let appendItem = "";
        if (indicator.data.length > 1) appendItem = `-${i}`;
        let value = d[index];
        if (value) return `Value${appendItem}: $${value.toFixed(2)}`;
        else return `Value${appendItem}: `;
      });
      acc[shortId] = {
        color: indicator.color,
        text: `${indicator.shortName}(${Object.values(indicator.params).join(
          ", "
        )}) ${v}`,
      };
    }
    setMeta(acc);
  }, [index, chart.indicators]);

  const handleClick = (event: React.MouseEvent<HTMLElement>, indicatorId: string) => {
    setAnchorEl(event.currentTarget);
    const params = indicators[indicatorId].params
    setStagingParams({ indicatorId: indicatorId, params: params ?? {} })
  };

  const handleRemove = (indicatorId: string) => {
    handleMenuClose();
    removeIndicator(props.id, indicatorId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleParametersClose = () => {
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setStagingParams({} as StagingParams);
  };

  return (
    <S.LegendContainer {...props} id={`${props.id}-legend`}>
      {Object.keys(meta).map((shortId, i) => {
        let params: { [param: string]: any } = {};
        let ind: IndicatorObject = {} as IndicatorObject;
        if (shortId !== "base") {
          ind = indicators[shortId as keyof typeof indicators];
          if (!ind) return <div key={`${props.id}-legend-${i}`} />
          params = { ...ind.params };
        }
        return (
          <React.Fragment key={`${props.id}-legend-${i}`}>
            <S.RowWrapper>
              <S.Circle color={meta[shortId].color} />{" "}
              <Typography variant="subtitle2" color="white">
                {meta[shortId].text}
              </Typography>
              <S.StyledIconButton
                disableRipple
                style={{ display: shortId === "base" ? "none" : "default" }}
                onClick={(e) => handleClick(e, shortId)}
              >
                <MdOutlineMoreHoriz size={typographyTheme.subtitle1.fontSize} />
              </S.StyledIconButton>
              <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom-start"
                style={{ zIndex: 1300 }}
              >
                <ClickAwayListener onClickAway={handleMenuClose}>
                  <S.StyledMenuList>
                    <S.StyledMenuItem onClick={() => handleRemove(shortId)}>
                      <DeleteIcon fontSize="inherit" />
                      <Typography variant="subtitle1">Remove</Typography>
                    </S.StyledMenuItem>
                    <S.StyledMenuItem onClick={handleParametersClose}>
                      <FunctionsIcon fontSize="inherit" />
                      <Typography variant="subtitle1">Parameters...</Typography>
                    </S.StyledMenuItem>
                  </S.StyledMenuList>
                </ClickAwayListener>
              </Popper>
            </S.RowWrapper>
            <BootstrapDialog
              maxWidth="md"
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={dialogOpen}
            >
              <BootstrapDialogTitle handleClose={handleClose}>
                Technical Indicators
              </BootstrapDialogTitle>
              <DialogContent dividers style={{ padding: 0, minWidth: "500px" }}>
                <Grid container>
                  <Table>
                    <TableBody>
                      {params
                        ? Object.keys(params).map((paramString: string) => {
                          return (
                            <StyledTableRow key={paramString}>
                              <StyledTableCell sx={{ paddingLeft: 2 }}>
                                <Typography variant="subtitle1">
                                  {capitalizeString(paramString)}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell key={paramString}>
                                <S.NumericInput
                                  type="number"
                                  value={
                                    stagingParams.params && stagingParams.params[paramString] ? stagingParams.params[paramString] :
                                    params[paramString]
                                  }
                                  style={{ width: "200px" }}
                                  onChange={(event) => {
                                    setStagingParams((oldParams) => ({
                                      ...oldParams,
                                      params: {[paramString]: Number(event.target.value)}
                                    }))
                                  }
                                  }
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          )
                        })
                        : null}
                    </TableBody>
                  </Table>
                </Grid>
                <Grid
                  container
                  sx={{ padding: 1 }}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Button
                    size="small"
                    variant="contained"
                    disableFocusRipple
                    onClick={() => {
                      // Create indicators and close
                      if (Object.keys(stagingParams.params).length !== 0) {
                        setIndicators(props.id, {
                          [stagingParams.indicatorId]: {
                            ...indicators[stagingParams.indicatorId],
                            params: stagingParams.params,
                            data: indicators[stagingParams.indicatorId].func(
                              data.map((entry) => {
                                if ("value" in entry) return entry.value;
                                else return entry.close;
                              }),
                              stagingParams.params
                            ),
                          },
                        });
                      }
                      handleClose();
                    }}
                    style={{
                      padding: "0 10px",
                    }}
                  >
                    <Typography variant="subtitle1">Save Settings</Typography>
                  </Button>
                </Grid>
              </DialogContent>
            </BootstrapDialog>
          </React.Fragment>
        );
      })}
    </S.LegendContainer>
  );
}
