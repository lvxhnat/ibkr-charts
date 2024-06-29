import { styled } from "@mui/system";

export const LegendContainer = styled("div")(({ theme }) => ({
  position: "absolute",
}));

interface CircleProps {
  color: string;
}
export const Circle = styled("div")<CircleProps>(({ theme, color }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "100%",
  backgroundColor: color,
}));

export const RowWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
}));
