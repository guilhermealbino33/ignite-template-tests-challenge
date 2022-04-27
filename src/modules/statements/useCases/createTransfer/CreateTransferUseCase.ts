import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ITransferDTO } from "./ITransferDTO";

interface IRequest {
  user_id: string;
}

interface IResponse {
  statement: Statement[];
  balance: number;
}

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ payerId, beneficiaryID, amount, description }: ITransferDTO) {
    const payer = await this.usersRepository.findById(payerId);
    const beneficiary = await this.usersRepository.findById(beneficiaryID);

    if (!payer) {
      throw new AppError("Payer ID not found!", 404);
    }
    if (!beneficiary) {
      throw new AppError("Beneficiary ID not found!", 404);
    }

    const payerBalance = await this.statementsRepository.getUserBalance({
      user_id: payerId,
    });

    if (amount > payerBalance.balance) {
      throw new AppError("Insufficient funds!", 400);
    }

    await this.statementsRepository.create({
      user_id: payerId,
      payer_id: beneficiaryID,
      amount,
      description,
      type: "transfer" as OperationType,
    });
  }
}
