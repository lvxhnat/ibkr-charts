import * as React from "react";
import * as S from "./style";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import searchTicker, { Ticker } from "./requests";
import { Grid, Typography } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import {
  BsCashStack,
  BsBank,
  BsPiggyBankFill,
  BsDiagram3Fill,
} from "react-icons/bs";
import { currencyToEmoji } from "../../../common/helper/countries";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { typographyTheme } from "../../../common/theme/typography";

type FilterTypes = "ALL" | "ETF" | "CASH" | "FUND" | "STK";
const filterType: FilterTypes[] = ["ALL", "ETF", "CASH", "FUND", "STK"];
const filterEmojis = {
  ALL: <AppsIcon fontSize="inherit" />,
  ETF: <BsDiagram3Fill size={"15px"} />,
  CASH: <BsCashStack size={"15px"} />,
  FUND: <BsBank size={"15px"} />,
  STK: <BsPiggyBankFill size={"15px"} />,
};

interface SearchProps {
  id: string;
  onClick: (d: Ticker) => void;
}

export default function Search(props: SearchProps) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const query = useDebounce(searchTerm, 500);
  const [filter, setFilter] = React.useState<number>(0);
  const [results, setResults] = React.useState<Ticker[]>([]);
  const [showMenu, setShowMenu] = React.useState(false); // New state to control menu visibility
  const inputRef = React.useRef<HTMLInputElement>(null); // Ref for the InputBase component

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    if (query.trim() !== "") {
      searchTicker(query, filterType[filter])
        .then((res) => {
          setResults(res.data);
          setShowMenu(res.data.length > 0);
        })
        .catch((err) => console.log(`Timeout Error when searching for ticker`));
    } else {
      setResults([]);
      setShowMenu(false);
    }
  }, [query]);

  React.useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("keydown", closeMenu);
    return () => document.removeEventListener("keydown", closeMenu);
  }, []);

  return (
    <React.Fragment>
      <Paper component="form" sx={{ maxWidth: 500 }}>
        <S.StyledPaper>
          <IconButton
            type="button"
            disableRipple
            style={{ padding: 0, paddingLeft: 5, fontSize: "15px" }}
            onClick={() => {
                setFilter((prev) => {
                if (prev < filterType.length - 1) return prev + 1;
                else return 0;
              })}
            }
          >
            {filterEmojis[filterType[filter] as keyof typeof filterEmojis]}
          </IconButton>
          <InputBase
            ref={inputRef}
            value={searchTerm}
            onChange={handleChange}
            sx={{
              ml: 1,
              flex: 1,
              p: 0,
              padding: 0, 
              fontSize: typographyTheme.subtitle2.fontSize,
            }}
            placeholder="Search Tickers"
            autoFocus
            inputProps={{
               style: {
                 padding: "max(1%, 3px) 0"
               }
            }}
        />
          <IconButton
            type="button"
            aria-label="search"
            sx={{ padding: "0 5px", fontSize: "15px" }}
          >
            <SearchIcon fontSize="inherit" />
          </IconButton>
        </S.StyledPaper>
      </Paper>
        <S.StyledMenuList hide={!showMenu} key={`${props.id}-menuList`}>
          {results.map((d) => (
            <S.StyledMenuItem
              key={d.conid}
              onClick={() => {
                props.onClick(d);
                setSearchTerm(d.localSymbol);
                setShowMenu(false);
              }}
            >
              <Grid container>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">{d.localSymbol}</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="subtitle2" noWrap align="center">
                    {d.description.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={2} alignItems="flex-end">
                  <Typography variant="subtitle2" align="right">
                    {
                      currencyToEmoji[
                        d.currency as keyof typeof currencyToEmoji
                      ]
                    }
                  </Typography>
                </Grid>
              </Grid>
            </S.StyledMenuItem>
          ))}
        </S.StyledMenuList>
    </React.Fragment>
  );
}
