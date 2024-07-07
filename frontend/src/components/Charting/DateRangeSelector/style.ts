import { Button, MenuItem, MenuList } from "@mui/material";
import { styled } from "@mui/system";
import { typographyTheme } from "../../../common/theme/typography";
import { ColorsEnum } from "../../../common/theme";

export const StyledMenuList = styled(MenuList)(({ theme }) => ({
  width: "150px",
  padding: 0,
  backgroundColor: ColorsEnum.darkGrey,
  color: ColorsEnum.white,
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: 5,
  padding: "5px 10px",
  fontSize: typographyTheme.button.fontSize,
  fontWeight: "bold",
  whiteSpace: "unset",
  wordBreak: "break-all",
}));

export const DateRangeWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const DateRangeSelectionBox = styled(Button)<{ selected?: boolean }>(
  ({ theme }) => ({
    zIndex: 10,
    padding: `1.4vh 0.8vw`,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: ColorsEnum.white,
    height: 0,
    border: `1px solid ${ColorsEnum.warmgray1}`,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: ColorsEnum.warmgray2,
    },
  })
);
