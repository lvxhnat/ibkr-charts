import * as React from "react";

import LivePlayer from "./LivePlayer";
import { ContainerWrapper } from "../../components/Wrappers";

export default function Landing() {
  return (
    <ContainerWrapper>
      <LivePlayer />
    </ContainerWrapper>
  );
}
