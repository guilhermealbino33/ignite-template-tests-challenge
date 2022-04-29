import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({
    statement,
    balance,
  }: {
    statement: Statement[];
    balance: number;
  }) {
    const parsedStatement = statement.map(
      ({
        id,
        payer_id,
        amount,
        description,
        type,
        created_at,
        updated_at,
      }) => ({
        id,
        sender_id: payer_id ? payer_id : undefined,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at,
      })
    );

    return {
      statement: parsedStatement,
      balance: Number(balance),
    };
  }
}
