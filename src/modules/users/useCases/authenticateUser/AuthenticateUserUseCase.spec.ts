import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate a user", async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "abcd",
    };

    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(result).toHaveProperty("token");
    expect(result.token.length).toBeGreaterThan(0);
  });

  it("Should not be able to authenticate inexistent user", async () => {
    try {
      const user = {
        name: "test",
        email: "test@email.com",
        password: "abcd",
      };

      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError);
      expect(error.message).toBe("Incorrect email or password");
    }
  });
});
