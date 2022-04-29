import { OperationType } from "../../entities/Statement";

export interface ITransferDTO {
  payerId: string;
  beneficiaryID: string;
  amount: number;
  description: string;
  type?: OperationType;
}
