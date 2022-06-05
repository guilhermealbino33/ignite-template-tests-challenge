import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: payerId } = request.user;
    const { user_id: beneficiaryID } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);
    console.log("payerId", payerId);
    console.log("beneficiaryID", beneficiaryID);

    await createTransferUseCase.execute({
      payerId,
      beneficiaryID,
      amount,
      description,
    });

    return response.status(201).json("Transfer concluded!");
  }
}
