import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Use Case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("Should be able to get an user statement operation ", async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "123",
    };

    const created_user = await createUserUseCase.execute(user);

    const deposit_statement = {
      user_id: created_user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test",
    };

    const created_statement = await createStatementUseCase.execute({
      user_id: created_user.id!,
      type: deposit_statement.type,
      amount: deposit_statement.amount,
      description: deposit_statement.description,
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: created_user.id!,
      statement_id: created_statement.id!,
    });

    expect(result).toBeInstanceOf(Statement);
    expect(result).toHaveProperty("id");
    expect(result.type).toBe(OperationType.DEPOSIT);
  });

  it("Should not be able to get a statement operation of a non existent user", async () => {
    try {
      const result = await getStatementOperationUseCase.execute({
        user_id: "inexistent_user",
        statement_id: "",
      });

      expect(result).toBeUndefined();
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(GetStatementOperationError.UserNotFound);
        expect(error.message).toBe("User not found");
      }
    }
  });

  it("Should not be able to get a statement operation that not exists", async () => {
    try {
      const user = {
        name: "test",
        email: "test@email.com",
        password: "123",
      };

      const created_user = await createUserUseCase.execute(user);
      const result = await getStatementOperationUseCase.execute({
        user_id: created_user.id!,
        statement_id: "inexistent_statement",
      });

      expect(result).toBeUndefined();
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(
          GetStatementOperationError.StatementNotFound
        );
        expect(error.message).toBe("Statement not found");
      }
    }
  });
});
