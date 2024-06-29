import React from "react";
import * as d3 from "d3";

export const useD3 = (
  renderChartFn: (...args: any[]) => void,
  dependencies: any[]
) => {
  // https://stackoverflow.com/questions/33796267/how-to-use-refs-in-react-with-typescript
  const ref = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => undefined;
  }, dependencies);

  return ref;
};
