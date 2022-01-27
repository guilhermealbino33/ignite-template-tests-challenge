import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { OperationType } from "../../entities/Statement";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get a balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      usersRepositoryInMemory
    );
  });

  it("Should be able to get a balance", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "username@email.com",
      name: "username",
      password: "1234"
    });

    const statement1 = await inMemoryStatementsRepository.create({
      amount: 4000,
      description: "DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    const statement2 = await inMemoryStatementsRepository.create({
      amount: 50,
      description: "WITHDRAW",
      type: OperationType.WITHDRAW,
      user_id: user.id as string
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    if (statement2.type === OperationType.WITHDRAW) {
      var balanceCalc = statement1.amount - statement2.amount;
    } else {
      var balanceCalc = statement1.amount + statement2.amount;
    }

    expect(balance).toHaveProperty("balance");
    expect(balance.balance).toEqual(balanceCalc);
    expect(balance.statement).toEqual(
      expect.arrayContaining([statement1, statement2]
      ))
  });

  it("Should not be able to get a balance from a non-existing user", async () => {
    await expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "9999"
      });
    }).rejects.toBeInstanceOf(GetBalanceError)
  });
});
