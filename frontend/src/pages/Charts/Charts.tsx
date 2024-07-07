import * as React from "react";
import Charting from "../../components/Charting";
import GridSelector from "../../components/Selector/GridSelector";
import { ContainerWrapper } from "../../components/Wrappers";

export default function Charts() {
  const [selection, setSelection] = React.useState<[number, number]>([0,0]);
  return <ContainerWrapper>
      <GridSelector selection={selection} setSelection={setSelection}/>
      <Charting id="SS"></Charting>;
  </ContainerWrapper>
}
