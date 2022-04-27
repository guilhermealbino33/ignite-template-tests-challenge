import { Request, Response } from "express";
import { container } from "tsyringe";

import { BalanceMap } from "../../mappers/BalanceMap";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const getBalance = container.resolve(CreateTransferUseCase);

    const transfer = await getBalance.execute({ user_id });

    const balanceDTO = BalanceMap.toDTO(transfer);

    return response.json(balanceDTO);
  }
}
