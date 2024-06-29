import AbcIcon from "@mui/icons-material/Abc";
import TagIcon from "@mui/icons-material/Tag";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FilterNoneIcon from "@mui/icons-material/FilterNone";

export type Types = "DATETIME" | "INT" | "TEXT" | "FLOAT" | "BLANK" | "BIGINT";

export const typeIconHints: { [column in Types]: React.ReactElement } = {
  BLANK: <FilterNoneIcon fontSize="inherit" sx={{ padding: 0 }} />,
  DATETIME: <DateRangeIcon fontSize="inherit" sx={{ padding: 0 }} />,
  FLOAT: <TagIcon fontSize="inherit" sx={{ padding: 0 }} />,
  INT: <TagIcon fontSize="inherit" sx={{ padding: 0 }} />,
  TEXT: <AbcIcon fontSize="inherit" sx={{ padding: 0 }} />,
  BIGINT: <TagIcon fontSize="inherit" sx={{ padding: 0 }} />,
};
