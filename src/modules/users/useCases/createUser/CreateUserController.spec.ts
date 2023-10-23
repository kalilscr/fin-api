import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const mocked_user2 = {
  name: "teste2",
  email: "teste2@email.com",
  password: "123",
};

const mocked_user3 = {
  name: "teste3",
  email: "teste3@email.com",
  password: "123",
};

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  afterAll(async () => {
    connection.close();
  });

  it("Should /POST /api/v1/users to create a new user", async () => {
    const result = await request(app).post("/api/v1/users").send({
      name: mocked_user2.name,
      email: mocked_user2.email,
      password: mocked_user2.password,
    });
    expect(result.status).toBe(201);
  });

  it("Should /POST /api/v1/users and dont create a existent user", async () => {
    await request(app).post("/api/v1/users").send({
      name: mocked_user3.name,
      email: mocked_user3.email,
      password: mocked_user3.password,
    });
    const result = await request(app).post("/api/v1/users").send({
      name: mocked_user3.name,
      email: mocked_user3.email,
      password: mocked_user3.password,
    });
    expect(result.status).toBe(400);
  });
});
