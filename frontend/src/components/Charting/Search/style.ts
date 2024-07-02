import { MenuItem, MenuList, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { ColorsEnum } from "../../../common/theme";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: 0,
  border: `1px solid ${ColorsEnum.darkGrey}`,
}));

export const StyledMenuList = styled(MenuList)(({ theme }) => ({
  position: "absolute",
  backgroundColor: ColorsEnum.darkGrey,
  color: ColorsEnum.white,
  zIndex: 100,
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: 5,
  fontWeight: "bold",
  width: `calc(350px + 2vw)`,
  whiteSpace: "unset",
  wordBreak: "break-all",
}));
