"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { AccountResType } from "@/schemaValidation/account.schema";
type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  fontSize: string | null;
  setFontSize: (size: string) => void;
  colorSetting: string | null;
  setColorSetting: (color: string) => void;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  fontSize: null,
  setFontSize: () => {},
  colorSetting: null,
  setColorSetting: () => {},
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
  const [user, setUsetState] = useState<User | null>(null);
  const isAuthenticated = Boolean(user);
  const setUser = useCallback(
    (user: User | null) => {
      setUsetState(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    [setUsetState]
  );

  const [fontSize, setFontSizeState] = useState("text-sm");
  useEffect(() => {
    setFontSizeState(localStorage.getItem("fontSize") || "text-sm");
    setColorSettingState(localStorage.getItem("colorSetting") || "");
  }, []);
  const setFontSize = useCallback(
    (size: string) => {
      setFontSizeState(size);
      localStorage.setItem("fontSize", size);
    },
    [setFontSizeState]
  );

  // setting theme color
  const [colorSetting, setColorSettingState] = useState("");
  const setColorSetting = useCallback(
    (color: string) => {
      setColorSettingState(color);
      localStorage.setItem("colorSetting", color);
    },
    [setColorSettingState]
  );

  useEffect(() => {
    const color = localStorage.getItem("colorSetting") ?? "";
    document.body.className = color;
  }, [colorSetting]);

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
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <SessionProvider session={session}>{children}</SessionProvider> */}
          {children}
        </ThemeProvider>
      </AppContext.Provider>
    </>
  );
}
