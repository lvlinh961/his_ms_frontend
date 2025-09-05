"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import LoadingOverlay from "@/components/layout/loading-overlay";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { AccountResType } from "@/schemaValidation/account.schema";
type User = AccountResType["data"];
const fontSizeDefault = "text-sm";

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  fontSize: string;
  setFontSize: (size: string) => void;
  colorSetting: string | null;
  setColorSetting: (color: string) => void;
  setLoadingOverlay: (isLoading: boolean | false) => void;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  fontSize: fontSizeDefault,
  setFontSize: () => {},
  colorSetting: null,
  setColorSetting: () => {},
  setLoadingOverlay: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(null);
  const isAuthenticated = Boolean(user);
  const [isLoading, setLoadingOverlayState] = useState(false);
  const [fontSize, setFontSizeState] = useState(fontSizeDefault);
  const [colorSetting, setColorSettingState] = useState("");

  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    [setUserState]
  );

  useEffect(() => {
    setFontSizeState(localStorage.getItem("fontSize") || fontSizeDefault);
    setColorSettingState(localStorage.getItem("colorSetting") || "");

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  const setFontSize = useCallback((size: string) => {
    setFontSizeState(size);
    localStorage.setItem("fontSize", size);
  }, []);

  // setting theme color

  const setColorSetting = useCallback(
    (color: string) => {
      setColorSettingState(color);
      localStorage.setItem("colorSetting", color);
    },
    [setColorSettingState]
  );

  // set loading overlay
  const setLoadingOverlay = useCallback(
    (isLoading: boolean) => {
      setLoadingOverlayState(isLoading);
    },
    [setLoadingOverlayState]
  );

  useEffect(() => {
    const color = localStorage.getItem("colorSetting") ?? "";
    document.body.className = color;
  }, [user, colorSetting]);

  const renderLoadingOverlay = () => {
    return isLoading ? <LoadingOverlay /> : <></>;
  };

  return (
    <>
      <AppContext.Provider
        value={{
          user,
          setUser,
          isAuthenticated,
          fontSize,
          setFontSize,
          colorSetting,
          setColorSetting,
          setLoadingOverlay,
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <SessionProvider session={session}>{children}</SessionProvider> */}
          {renderLoadingOverlay()}
          {children}
        </ThemeProvider>
      </AppContext.Provider>
    </>
  );
}
