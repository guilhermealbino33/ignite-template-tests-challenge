import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });
  it("Should be able to create a new statement.", async () => {
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

    expect(statement).toHaveProperty("id");
    expect(statement.user_id).toEqual(user.id);
  });
  it("Should not be able to create a new statement without an existing user.", async () => {
    await expect(async () => {
      await createStatementUseCase.execute({
        amount: 50,
        description: "WITHDRAW",
        type: OperationType.WITHDRAW,
        user_id: "ANY"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })
});

