import { ThemeMode } from "../types";
import { ColorsEnum } from "./colors";

const defaultPalette = {
  primary: {
    main: ColorsEnum.primary,
    light: ColorsEnum.secondary,
  },
  secondary: {
    main: ColorsEnum.secondary,
  },
  success: {
    main: ColorsEnum.success,
  },
  error: {
    main: ColorsEnum.error,
  },
};

export const darkPalette = {
  ...defaultPalette,
  mode: "dark" as ThemeMode,
  background: {
    default: ColorsEnum.black,
  },
};

export const lightPalette = {
  ...defaultPalette,
  mode: "light" as ThemeMode,
  background: {
    default: ColorsEnum.white,
  },
  color: ColorsEnum.black,
};
