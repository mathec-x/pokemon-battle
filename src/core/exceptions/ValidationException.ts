export class ValidationException extends Error {
  code: number;
  data: Record<string, unknown>;
  message: string;

  constructor(message: string, data = {}) {
    super(message);
    this.message = message;
    this.data = data;
    this.code = 400;
  }
}