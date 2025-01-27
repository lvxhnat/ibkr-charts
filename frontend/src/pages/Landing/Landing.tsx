import * as React from "react";
import LivePlayer from "./LivePlayer";
import { ContainerWrapper } from "../../components/Wrappers";
import { Grid } from "@mui/material";

export default function Landing() {
  return (
    <ContainerWrapper>
      <Grid container>
        <Grid item xs={6}>
          <LivePlayer />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
