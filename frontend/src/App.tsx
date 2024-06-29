import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./common/constant";
import Landing from "./pages/Landing";
import Charts from "./pages/Charts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LANDING} element={<Landing />} />
        <Route path={ROUTES.CHARTING} element={<Charts />} />
      </Routes>
    </Router>
  );
}

export default App;
