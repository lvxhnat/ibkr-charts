import * as React from "react";
import * as S from "./style";
import { Typography } from "@mui/material";
import { ColorsEnum } from "../../../../../common/theme";

interface StyledTableCellProps {
  children?: React.ReactNode;
  isHeader?: boolean;
  width?: string;
  color?: string;
  align?: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  [props: string]: any;
}

export function StyledTableCell({
  children,
  isHeader,
  width,
  color,
  align,
  variant,
  ...props
}: StyledTableCellProps) {
  return (
    <S.TableCellWrapper {...props} width={width}>
      <Typography
        noWrap
        variant={variant ?? "subtitle2"}
        align={align ?? "left"}
        component="div"
        style={{
          color: ColorsEnum.white,
        }}
      >
        {children}
      </Typography>
    </S.TableCellWrapper>
  );
}

export function StyledChartCell({ children, width }: StyledTableCellProps) {
  return <S.TableCellWrapper width={width}>{children}</S.TableCellWrapper>;
}
