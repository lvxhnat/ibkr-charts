import * as React from "react";
import { ColorsEnum } from "../../../common/theme";
import { getHistoricalData } from "../requests";
import { Typography } from "@mui/material";
import { ChartProps } from "../Chart";

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

  ws.onmessage = function (event) {
    setPriceInfo(JSON.parse(event.data));
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
  conId: number;
}

export default function LivePrice(props: LivePriceProps) {
  const defaultColor = ColorsEnum.grey;
  const [openPrice, setOpenPrice] = React.useState<number>();
  const [priceInfo, setPriceInfo] = React.useState<PriceInfo>({} as PriceInfo);

  React.useEffect(() => {
    const socket = connectPriceSocket(setPriceInfo, props.conId);
    getHistoricalData(props.conId, {
      duration: "5 D",
      interval: "1 day",
    })
      .then((res) => {
        setOpenPrice(res.data[res.data.length - 2].close);
      })
      .catch((err) =>
        console.log(
          `Timeout error when requesting data for contract ${props.conId}`
        )
      );
    return () => {
      socket.close();
      console.log("PriceInfoShower WebSocket Connection Closed");
    };
  }, [props.conId]);

  return priceInfo.status !== "error" && priceInfo.status ? (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="body2"
        style={{
          color: defaultColor,
        }}
      >
        ${priceInfo.last ? priceInfo.last.toFixed(2) : "-"}
      </Typography>

      <div>
        <div>
          <Typography
            variant="subtitle2"
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
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: -3 }}>
          <Typography
            variant="subtitle2"
            style={{
              color: defaultColor,
            }}
          >
            Last Bid: $
            {priceInfo.last_bid ? priceInfo.last_bid.toFixed(2) : "-"}
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: defaultColor,
            }}
          >
            Last Ask: $
            {priceInfo.last_ask ? priceInfo.last_ask.toFixed(2) : "-"}
          </Typography>
        </div>
      </div>
    </div>
  ) : null;
}
