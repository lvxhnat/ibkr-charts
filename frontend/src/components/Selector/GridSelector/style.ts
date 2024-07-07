import { styled } from "@mui/system";
import { ColorsEnum, hexToRGBA } from "../../../common/theme";

interface SingleBoxProps {
  selection: [number, number];
  indices: [number, number];
  hover: [number, number];
}
export const SingleBox = styled("div")<SingleBoxProps>(
  ({ theme, selection, indices, hover }) => {
    const hoverBaseColor =
      theme.palette.mode === "dark" ? ColorsEnum.white : ColorsEnum.darkGrey;
    return {
      width: "33px",
      height: "33px",
      borderLeft: `1px solid ${ColorsEnum.grey}`,
      borderTop: `1px solid ${ColorsEnum.grey}`,
      backgroundColor:
        indices[0] <= hover[0] && indices[1] <= hover[1]
          ? hexToRGBA(hoverBaseColor, 0.1)
          : indices[0] <= selection[0] && indices[1] <= selection[1]
          ? hexToRGBA(hoverBaseColor, 0.3)
          : "transparent",
    };
  }
);

export const RowWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "33px",
}));

export const ColumnWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "99px",
  height: "99px",
  borderRight: `1px solid ${
    theme.palette.mode === "dark" ? ColorsEnum.grey : ColorsEnum.darkGrey
  }`,
  borderBottom: `1px solid ${
    theme.palette.mode === "dark" ? ColorsEnum.grey : ColorsEnum.darkGrey
  }`,
  borderRadius: 5,
}));