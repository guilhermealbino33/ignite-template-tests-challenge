import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO = Pick<
  Statement,
  "user_id" | "payer_id" | "description" | "amount" | "type"
>;
