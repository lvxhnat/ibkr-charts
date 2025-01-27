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

interface StyledMenuListProps {
  hide: boolean;
}

export const StyledMenuList = styled(MenuList, {
  shouldForwardProp: (prop) => prop !== "isChecked"
})<StyledMenuListProps>(({ theme, hide }) => ({
  position: "absolute",
  backgroundColor: ColorsEnum.darkGrey,
  display: hide ? "none" : undefined,
  color: ColorsEnum.white,
  zIndex: 100,
  maxHeight: "200px",
  overflowY: "auto",
  "&::-webkit-scrollbar": { display: "none" },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: 5,
  fontWeight: "bold",
  width: `calc(350px + 2vw)`,
  whiteSpace: "unset",
  wordBreak: "break-all",
}));
