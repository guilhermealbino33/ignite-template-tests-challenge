import { AppError } from "../../../../shared/errors/AppError";

export class CreateTransferError extends AppError {
  constructor() {
    super('User not found', 404);
  }
}
