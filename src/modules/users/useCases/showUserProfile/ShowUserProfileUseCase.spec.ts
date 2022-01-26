import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {


  it("should be able to show user profile", async () => {
    const userDTO: ICreateUserDTO = {
      name: "username",
      email: "username@email.com",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(userDTO);

    const result = await showUserProfileUseCase.execute(
      userCreated.id as string
    );

    expect(userCreated).toEqual(result);
  });
});
