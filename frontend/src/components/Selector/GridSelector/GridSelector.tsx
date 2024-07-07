import * as React from "react";
import * as S from "./style";
import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import GridOnIcon from "@mui/icons-material/GridOn";

interface GridSelectorProps {
  selection: [number, number];
  setSelection: (v: [number, number]) => void;
}

export default function GridSelector(props: GridSelectorProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [hover, setHover] = React.useState<[number, number]>([0, 0]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ padding: 0, paddingBottom: 1 }}
      >
        <GridOnIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          root: { sx: { ".MuiList-root": { padding: 0 } } },
        }}
      >
        <MenuItem
          disableRipple
          sx={{ padding: 0, "&:hover": { backgroundColor: "transparent" } }}
        >
          <S.ColumnWrapper>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <S.RowWrapper key={`row-${i}`}>
                  {Array(3)
                    .fill(0)
                    .map((_, j) => (
                      <S.SingleBox
                        key={`row-${i}-col-${j}`}
                        sx={{
                          borderTopLeftRadius: i === 0 && j === 0 ? 5 : 0,
                          borderBottomLeftRadius: i === 2 && j === 0 ? 5 : 0,
                        }}
                        onClick={() => {
                          props.setSelection([i, j]);
                          setAnchorEl(null);
                        }}
                        onMouseOver={() => setHover([i, j])}
                        indices={[i, j]}
                        selection={props.selection}
                        hover={hover}
                      />
                    ))}
                </S.RowWrapper>
              ))}
          </S.ColumnWrapper>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};