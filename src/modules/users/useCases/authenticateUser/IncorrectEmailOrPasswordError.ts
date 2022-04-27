import { AppError } from "../../../../shared/errors/AppError";

export class IncorrectEmailOrPasswordError extends AppError {
  constructor() {
    super("Incorrect e-mail or password", 401);
  }
}
