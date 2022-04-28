import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

export class AuthenticateUserController {
  async execute(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      const authenticateUser = container.resolve(AuthenticateUserUseCase);

      const { user, token } = await authenticateUser.execute({
        email,
        password,
      });

      return response.json({ user, token });
    } catch (error) {
      console.log(error);
      return response
        .status(401)
        .json(new AppError("Incorrect e-mail or password", 401));
    }
  }
}
