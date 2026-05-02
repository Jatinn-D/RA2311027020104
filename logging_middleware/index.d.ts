export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";

export function Log(level: LogLevel, pkg: FrontendPackage, message: string): Promise<any>;