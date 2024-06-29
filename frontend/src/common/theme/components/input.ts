import { ColorsEnum } from "../colors";

export const inputTheme = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        // transition: theme.transitions.create(['box-shadow']),
        // '&.Mui-focused': {
        //   boxShadow: `${ColorsEnum.tangerine5} 0 0 0 3px`,
        //   '.MuiOutlinedInput-notchedOutline': {
        //     borderWidth: '1px',
        //   },
        // },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "input:-webkit-autofill": {
          WebkitBoxShadow:
            theme.palette.mode === "light"
              ? "0 0 0 30px #ffffff inset"
              : "0 0 0 30px #202020 inset, 0 0 0 1px #202020 inset, 0 0 0 1px #202020 inset, 0 0 0 1px #202020 inset",
        },
      }),
    },
  },
};
