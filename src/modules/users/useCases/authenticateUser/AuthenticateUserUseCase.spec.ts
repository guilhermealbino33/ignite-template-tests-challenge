import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate a user", async () => {
    const password = await hash("1234", 8);

    const user = await createUserUseCase.execute({
      name: "user",
      email: "username@email.com",
      password,
    });
    console.log("user", user);

    const session = await authenticateUserUseCase.execute({
      email: user.email,
      password: "1234",
    });
    console.log("session", session);
    expect(session).toHaveProperty("token");
    expect(session).toHaveProperty("user");

    expect(session.user).toHaveProperty("id");
    expect(session.user.id).toBe(user.id);
    expect(session.user).toHaveProperty("name");
    expect(session.user.name).toBe(user.name);
    expect(session.user).toHaveProperty("email");
    expect(session.user.email).toBe(user.email);
  });
});
it("Should not be able to authenticate a wrong user password", async () => {
  const password = await hash("1234", 8);

  await inMemoryUsersRepository.create({
    email: "username@email.com",
    name: "username",
    password: password,
  });
  expect(async () => {
    await authenticateUserUseCase.execute({
      email: "username@email.com",
      password: "4321",
    });
  }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
});
it("Should not be able to authenticate a wrong user e-mail", async () => {
  const password = await hash("1234", 8);

  await inMemoryUsersRepository.create({
    email: "username@email.com",
    name: "username",
    password: password,
  });
  expect(async () => {
    await authenticateUserUseCase.execute({
      email: "wrong@email.com",
      password: "1234",
    });
  }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
});
