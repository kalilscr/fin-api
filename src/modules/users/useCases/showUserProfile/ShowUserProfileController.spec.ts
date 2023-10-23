import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const mocked_user = {
  name: "teste",
  email: "teste@email.com",
  password: "123",
};

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  afterAll(async () => {
    connection.close();
  });

  it("Should /GET /api/v1/profile to show an user profile", async () => {
    const authenticationResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: mocked_user.email, password: mocked_user.password });
    const { token } = authenticationResponse.body;
    const showProfileResponse = await request(app)
      .get("/api/v1/profile")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(showProfileResponse.status).toBe(200);
    expect(showProfileResponse.body).toHaveProperty("id");
  });

  it("Should /GET /api/v1/profile and dont show non authenticated user profile", async () => {
    const showProfileResponse = await request(app)
      .get("/api/v1/profile")
      .send();
    expect(showProfileResponse.status).toBe(401);
    expect(showProfileResponse.body).toStrictEqual({
      message: "JWT token is missing!",
    });
  });
});
