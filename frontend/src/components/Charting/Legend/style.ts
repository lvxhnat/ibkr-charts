import { IconButton, MenuItem, MenuList } from "@mui/material";
import { styled } from "@mui/system";
import { typographyTheme } from "../../../common/theme/typography";
import { ColorsEnum } from "../../../common/theme";

export const StyledMenuList = styled(MenuList)(({ theme }) => ({
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

export const LegendContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  marginLeft: "2%",
  minWidth: "500px",
  paddingTop: "5px"
}));

interface CircleProps {
  color: string;
}
export const Circle = styled("div")<CircleProps>(({ theme, color }) => ({
  width: "max(5px, 0.5vw)",
  height: "max(5px, 0.5vw)",
  borderRadius: "100%",
  backgroundColor: color,
}));

export const RowWrapper = styled("div")(({ theme }) => ({
  gap: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingLeft: "min(20px, 3%)"
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  "&:hover": {
    opacity: 0.8,
  },
}));

export const NumericInput = styled("input")(({ theme }) => ({
  border: `1px solid ${ColorsEnum.warmgray1}`,
  color: ColorsEnum.white,
  backgroundColor: "transparent",
  borderRadius: "5px",
  fontSize: "12px",
  outline: "none",
  padding: 5,
}));
