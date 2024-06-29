import { ColorsEnum } from "../colors";

export const linkTheme = {
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: "none",
        color: "grey",
        "&:hover": { color: ColorsEnum.primary, textDecoration: "none" },
      },
    },
  },
};
