import * as React from "react";

import { Alert, CssBaseline, Divider, Snackbar, Stack } from "@mui/material";
import { ALERTS } from "../../../common/constant/literals";
import { useNetworkStatus } from "../../Providers/NetworkStatusProvider";

export interface ContainerWrapperProps {
  children: React.ReactNode;
  hideNavigate?: boolean;
}

function DisconnectAlert() {
  const connected = useNetworkStatus()

  return !connected ? (
    <Snackbar open={true}>
      <Alert severity="error"> {ALERTS.OFFLINE} </Alert>
    </Snackbar>
  ) : null;
}

export default function ContainerWrapper(props: ContainerWrapperProps) {
  return (
    <Stack
      style={{
        height: "100vh",
        paddingLeft: 20,
        paddingRight: 20,
      }}
      alignItems="center"
    >
      <CssBaseline />
      {props.hideNavigate ? <></> : <Divider style={{ width: "100%" }} />}
      <div
        style={{
          paddingTop: 10,
          height: "100%",
          width: "100%",
          overflowY: "hidden",
        }}
      >
        {props.children}
      </div>
      <DisconnectAlert />
    </Stack>
  );
}
