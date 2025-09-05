"use client";
import React, { useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useAppContext } from "@/providers/app-proviceders";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FontSize, Theme } from "@/types";
import { fontsSetting, themesColorSetting } from "@/constants/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CompProps = {};

export default function ThemeToggle({}: CompProps) {
  const { setTheme, theme } = useTheme();
  const [darkMode, setDarkMode] = useState(theme === "light" ? false : true);
  const { fontSize, setFontSize, colorSetting, setColorSetting } =
    useAppContext();

  const handleChange = () => {
    setDarkMode(!darkMode);
    setTheme(darkMode ? "light" : "dark");
    setColorSetting("");
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
  };

  const changeThemeColor = (color: string) => {
    setDarkMode(false);
    setTheme("light");
    setColorSetting(color);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-[hsl(var(--color-custom-2))]"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme setting</DropdownMenuLabel>
        <DropdownMenuItem>
          <span className="mr-2">Light </span>
          <Switch
            id="airplane-mode"
            defaultChecked={darkMode}
            onCheckedChange={() => handleChange()}
          />
          <span className="ml-2">Dark</span>
        </DropdownMenuItem>
        {themesColorSetting.map((theme: Theme, index: number) => {
          return (
            <DropdownMenuRadioGroup
              key={`theme-${index}`}
              value={colorSetting || ""}
              onValueChange={changeThemeColor}
            >
              <DropdownMenuRadioItem value={theme.value}>
                <div
                  className={cn(
                    `w-5 h-5 rounded-full border`,
                    theme.color === "blue" ? "bg-blue-600" : "",
                    theme.color === "green" ? "bg-green-600" : "",
                    theme.color === "orange" ? "bg-orange-600" : "",
                    theme.color === "default" ? "bg-white-600" : ""
                  )}
                ></div>
                <span className="ml-2">{theme.label}</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Font Setting</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={fontSize} onValueChange={changeFontSize}>
          {fontsSetting.map((fontSize: FontSize, index: number) => {
            return (
              <DropdownMenuRadioItem key={index} value={fontSize.value}>
                {fontSize.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
