import { alpha } from "@mui/material";

import { ColorsEnum } from "../colors";

export const cardTheme = {
  MuiCard: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        backgroundColor:
          theme.palette.mode === "light"
            ? alpha(ColorsEnum.white, 0.9)
            : alpha(ColorsEnum.darkMode, 0.9),
      }),
    },
  },
};
