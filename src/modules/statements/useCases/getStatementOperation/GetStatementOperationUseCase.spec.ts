import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get a deposit statement operation.", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "username@email.com",
      name: "username",
      password: "1234"
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 50,
      description: "DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });
    expect(statement).toHaveProperty("type");
    expect(statement.type).toEqual(OperationType.DEPOSIT);
  });
  it("Should be able to get a withdraw statement operation.", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "username@email.com",
      name: "username",
      password: "1234"
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 50,
      description: "WITHDRAW",
      type: OperationType.WITHDRAW,
      user_id: user.id as string
    });
    expect(statement).toHaveProperty("type");
    expect(statement.type).toEqual(OperationType.WITHDRAW);
  });

  it("Should not be able to get a statement operation from a non existing user", async () => {
    const statement = await inMemoryStatementsRepository.create({
      amount: 50,
      description: "WITHDRAW",
      type: OperationType.WITHDRAW,
      user_id: "1234"
    });
    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });
  it("Should not be able to get a statement operation from a non existing statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "username@email.com",
      name: "username",
      password: "1234"
    });
    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "ANY",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
});

