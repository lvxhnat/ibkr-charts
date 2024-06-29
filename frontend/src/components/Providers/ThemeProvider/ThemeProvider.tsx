import * as React from "react";
import { ThemeProvider as ThemeMUIProvider } from "@mui/material/styles";
import { FC } from "react";
import { createTheme } from "../../../common/theme";

interface ThemeProviderProps {
  children?: React.ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return <ThemeMUIProvider theme={createTheme("dark")}>{children}</ThemeMUIProvider>;
};

export default ThemeProvider;
