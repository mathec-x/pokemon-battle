export interface LoggerServicePort {
  // Log level checks
  isVerboseEnabled(): boolean;
  isDebugEnabled(): boolean;
  isInfoEnabled(): boolean;
  isWarnEnabled(): boolean;
  isHttpEnabled(): boolean;
  isErrorEnabled(): boolean;
  isAlertEnabled(): boolean;
  isCriticalEnabled(): boolean;

  // Logging methods
  verbose(message: string, ...optionalParams: any[]): void;
  debug(message: string, ...optionalParams: any[]): void;
  info(message: string, ...optionalParams: any[]): void;
  warn(message: string, ...optionalParams: any[]): void;
  http(message: string, ...optionalParams: any[]): void;
  error(message: string, ...optionalParams: any[]): void;
  alert(message: string, ...optionalParams: any[]): void;
  critical(message: string, ...optionalParams: any[]): void;
}