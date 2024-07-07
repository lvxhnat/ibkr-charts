import { Grid } from "@mui/material";
import * as React from "react";
import Charting from "../../components/Charting";
import GridSelector from "../../components/Selector";
import { ContainerWrapper } from "../../components/Wrappers";

export default function Charts() {
  const [selection, setSelection] = React.useState<[number, number]>([0, 0]);
  return (
    <ContainerWrapper>
      <GridSelector selection={selection} setSelection={setSelection} />
      <Grid
        container
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {Array(selection[0] + 1)
          .fill(0)
          .map((_, i) => (
            <Grid
              container
              key={`row-${i}`}
              sx={{ height: `${100 / (selection[0] + 1)}%` }}
              spacing={1}
            >
              {Array(selection[1] + 1)
                .fill(0)
                .map((_, j) => (
                  <Grid
                    item
                    key={`row-${i}-${j}`}
                    xs={12 / (selection[0] + 1)}
                    sx={{ height: "100%" }}
                  >
                    <Charting id={`chart-${i}-${j}`} />
                  </Grid>
                ))}
            </Grid>
          ))}
      </Grid>
    </ContainerWrapper>
  );
}
