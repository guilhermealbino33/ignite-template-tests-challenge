import "reflect-metadata";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;


describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
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

  });
});

