import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Show User Profile User Case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("Should be able to show user profile", async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "abcd",
    };

    const created_user = await createUserUseCase.execute(user);
    const result = await showUserProfileUseCase.execute(created_user.id!);
    expect(result).toHaveProperty("id");
  });

  it("Should not be able to show a non existent user profile", async () => {
    try {
      const result = await showUserProfileUseCase.execute("inexistent_id");
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(ShowUserProfileError);
      expect(error.message).toBe("User not found");
    }
  });
});
