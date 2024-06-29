import { styled } from "@mui/system";

import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { ColorsEnum } from "../../../../../common/theme";

export const TableCellWrapper = styled(TableCell)(({ theme }) => ({
  padding: `${theme.spacing(0.5)} ${theme.spacing(0.5)}`,
}));

export const TableCellLabel = styled(Typography)(({ theme }) => ({
  color: ColorsEnum.white,
}));
