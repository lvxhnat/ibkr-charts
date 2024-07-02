import * as React from "react";

type NetworkStatusContextType = boolean | null;

interface NetworkStatusProviderProps {
  children: React.ReactNode;
}

const NetworkStatusContext =
  React.createContext<NetworkStatusContextType>(null);

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({
  children,
}) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    const connection: any = (navigator as any).connection;
    if ("connection" in navigator) {
      connection.addEventListener("change", updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);

      if ("connection" in navigator) {
        connection.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={isOnline}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = () => React.useContext(NetworkStatusContext);
