import envConfig from "@/config";

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private enabled: boolean;
  private prefix: string;

  constructor(enabled: boolean = true, prefix: string = "[Logger]") {
    this.enabled = enabled;
    this.prefix = prefix;
  }

  setEnabled(value: boolean) {
    this.enabled = value;
  }

  log(level: LogLevel, ...args: unknown[]) {
    if (!this.enabled) return;

    const message = `${this.prefix} ${level.toUpperCase()}:`;
    switch (level) {
      case "debug":
        console.debug(message, ...args);
        break;
      case "info":
        console.info(message, ...args);
        break;
      case "warn":
        console.warn(message, ...args);
        break;
      case "error":
        console.error(message, ...args);
        break;
      default:
        console.log(message, ...args);
        break;
    }
  }

  debug(...args: unknown[]) {
    this.log("debug", ...args);
  }

  info(...args: unknown[]) {
    this.log("info", ...args);
  }

  warn(...args: unknown[]) {
    this.log("warn", ...args);
  }

  error(...args: unknown[]) {
    this.log("error", ...args);
  }
}

export const logger = new Logger(
  envConfig.NEXT_PUBLIC_ENABLE_LOGGING === "true"
);
