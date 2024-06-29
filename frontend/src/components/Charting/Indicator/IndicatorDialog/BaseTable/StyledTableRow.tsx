import { styled } from "@mui/system";

import TableRow from "@mui/material/TableRow";
import { ColorsEnum } from "../../../../../common/theme";

type StyledTableRowProps = {
  clickable?: boolean;
};

export const StyledTableRow = styled(TableRow)<StyledTableRowProps>(
  ({ theme, clickable = true }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    "&:hover": {
      cursor: clickable ? "pointer" : "default",
      backgroundColor: ColorsEnum.darkGrey,
    },
  })
);
