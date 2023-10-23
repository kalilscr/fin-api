import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User Use Case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "123",
    };

    const result = await createUserUseCase.execute(user);
    expect(result).toBeInstanceOf(User);
  });

  it("Should not be able to create an existent user", async () => {
    try {
      const user = {
        name: "test",
        email: "test@email.com",
        password: "123",
      };

      await createUserUseCase.execute(user);
      const result = await createUserUseCase.execute(user);
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(CreateUserError);
      expect(error.message).toBe("User already exists");
    }
  });
});
