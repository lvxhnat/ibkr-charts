import { Grid } from "@mui/material";
import * as React from "react";
import Charting from "../../components/Charting";
import GridSelector from "../../components/Selector";
import { ContainerWrapper } from "../../components/Wrappers";

export default function Charts() {
  const [selection, setSelection] = React.useState<[number, number]>([0, 0]);
  return (
    <ContainerWrapper>
      <Grid container sx={{ width: "100%" }} display="flex" justifyContent="flex-end">
        <GridSelector selection={selection} setSelection={setSelection} />
      </Grid>
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
                    xs={12 / (selection[1] + 1)}
                    sx={{ height: "100%", width: `${100 / (selection[1] + 1)}%` }}
                  >
                    <Charting isSmall={selection[1] > 1} id={`chart-${i}-${j}`} />
                  </Grid>
                ))}
            </Grid>
          ))}
      </Grid>
    </ContainerWrapper>
  );
}
