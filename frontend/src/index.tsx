import App from "./App";
import ReactDOM from "react-dom/client";
import { NetworkStatusProvider } from "./components/Providers";
import ThemeProvider from "./components/Providers/ThemeProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function ThemedApp() {
  return (
    <NetworkStatusProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </NetworkStatusProvider>
  );
}

root.render(<ThemedApp />);
