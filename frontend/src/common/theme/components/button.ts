import { ColorsEnum } from "../colors";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    outlined2: true;
  }
}

export const buttonTheme = {
  MuiButton: {
    variants: [
      {
        props: { variant: "outlined2" as const },
        style: {
          textTransform: "none" as const,
          border: `1px solid ${ColorsEnum.coolgray2}`,
        },
      },
    ],
    styleOverrides: {
      root: {
        textTransform: "none" as const,
        fontSize: "calc(0.8rem + 0.15vw)",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
        "&.MuiButton-containedPrimary": {
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: "4px",
      },
    },
  },
};
