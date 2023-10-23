import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const mocked_user = {
  name: "Teste",
  email: "teste@email.com",
  password: "123",
};

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  afterAll(async () => {
    connection.close();
  });

  it("Should /POST /api/v1/sessions to authenticate an existent user", async () => {
    const authenticationResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: mocked_user.email, password: mocked_user.password });

    expect(authenticationResponse.status).toBe(200);
    expect(authenticationResponse.body).toHaveProperty("token");
  });

  it("Should /POST /api/v1/sessions and dont authenticate a non existent user", async () => {
    const authenticationResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "inexistent_email", password: "inexistent_password" });

    expect(authenticationResponse.status).toBe(401);
    expect(authenticationResponse.body).toStrictEqual({
      message: "Incorrect email or password",
    });
  });
});
