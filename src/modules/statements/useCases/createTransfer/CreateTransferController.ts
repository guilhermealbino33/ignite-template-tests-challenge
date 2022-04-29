import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: payerId } = request.user;
    const { beneficiaryID } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    await createTransferUseCase.execute({
      payerId,
      beneficiaryID,
      amount,
      description,
    });

    return response.status(201).send("Transfer concluded!");
  }
}
