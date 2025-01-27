import * as React from "react";
import { ColorsEnum } from "../../../common/theme";
import { getHistoricalData } from "../requests";
import { Typography } from "@mui/material";
import { ChartProps } from "../Chart";
import { throttle } from "lodash";
import { Ticker } from "../Search/requests";
import { getLastTradingDayNotToday } from "../../../common/constant/dates";

export interface PriceInfo {
  status: "live" | "frozen" | "delayed" | "delayed frozen" | "error";
  last: number;
  last_size: number;
  last_bid: number;
  last_bid_size: number;
  last_ask: number;
  last_ask_size: number;
  dividends: number;
}

export function connectPriceSocket(
  setPriceInfo: (value: PriceInfo) => void,
  conId: number
) {
  let ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL!}/contract/${conId}/price`
  );
  const throttledSetPriceInfo = throttle(setPriceInfo, 1000);

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    throttledSetPriceInfo(data);
  };

  ws.onerror = function (err: any) {
    ws.close();
    setTimeout(function () {
      connectPriceSocket(setPriceInfo, conId);
    }, 2000);
  };
  return ws;
}

interface LivePriceProps extends Omit<ChartProps, "children"> {
  ticker: Ticker;
  isSmall: boolean;
}

export default function LivePrice(props: LivePriceProps) {
  const defaultColor = ColorsEnum.white;
  const [openPrice, setOpenPrice] = React.useState<number>();
  const [lastUpdated, setLastUpdated] = React.useState<Date>();
  const [lastClose, setLastClose] = React.useState<number>();
  const [priceInfo, setPriceInfo] = React.useState<PriceInfo>({} as PriceInfo);

  const conId = props.ticker.conid;

  const updatePriceInfo = (value: PriceInfo) => {
    setLastUpdated(new Date());
    setPriceInfo(value);
  };

  React.useEffect(() => {
    const socket = connectPriceSocket(updatePriceInfo, conId);
    console.log("s");
    getHistoricalData(conId, {
      duration: "5 D",
      interval: "1 day",
    })
      .then((res) => {
        const entry = getLastTradingDayNotToday(res.data);
        const lastClose = (entry ?? res.data[res.data.length - 1]).close;
        setLastClose(lastClose);
        setOpenPrice(lastClose);
      })
      .catch((err) =>
        console.log(`Timeout error when requesting data for contract ${conId}`)
      );
    return () => {
      socket.close();
      console.log("PriceInfoShower WebSocket Connection Closed");
    };
  }, [conId]);

  return priceInfo.status !== "error" && priceInfo.status ? (
    <div
      style={{
        display: "flex",
        gap: 5,
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "180px" }}>
        <Typography
          color={ColorsEnum.coolgray6}
          variant="subtitle2"
          noWrap
          padding={0}
          lineHeight={1}
        >
          {props.isSmall
            ? props.ticker.localSymbol
            : `(${props.ticker.localSymbol}) ${props.ticker.description}`}
        </Typography>
        <Typography
          variant="subtitle2"
          padding={0}
          lineHeight={1.5}
          color={ColorsEnum.grey}
        >
          {props.isSmall
            ? lastUpdated?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : `Last Updated: ${lastUpdated?.toLocaleTimeString()}`}{" "}
        </Typography>
      </div>
      <Typography
        variant="subtitle1"
        style={{
          color: openPrice
          ? openPrice < priceInfo.last
            ? ColorsEnum.green
            : ColorsEnum.red
          : defaultColor,
        }}
      >
        ${priceInfo.last ? priceInfo.last.toFixed(2) : "-"}
      </Typography>

      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          minWidth: "90px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: 5,
          }}
        >
          <Typography
            variant="subtitle2"
            lineHeight={1}
            style={{
              padding: 0,
              color: openPrice
                ? openPrice < priceInfo.last
                  ? ColorsEnum.green
                  : ColorsEnum.red
                : defaultColor,
            }}
          >
            {priceInfo.last && openPrice
              ? `${(priceInfo.last - openPrice).toFixed(2)} (${(
                  (100 * (priceInfo.last - openPrice)) /
                  priceInfo.last
                ).toFixed(2)}%)`
              : null}
          </Typography>
          <Typography variant="subtitle2" lineHeight={1}>
            LC: ${lastClose}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Typography variant="subtitle2" color={defaultColor}>
            B: ${priceInfo.last_bid ? priceInfo.last_bid.toFixed(2) : "-"}
          </Typography>
          <Typography variant="subtitle2" color={defaultColor}>
            A: ${priceInfo.last_ask ? priceInfo.last_ask.toFixed(2) : "-"}
          </Typography>
        </div>
      </div>
    </div>
  ) : null;
}
