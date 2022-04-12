import request from "supertest";
import { Connection } from "typeorm";


import createConnection from "../../../../database";
import { app } from "../../../../app";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';

let connection: Connection;
let user: {
  name: string;
  email: string;
  password: string;
}

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("1234", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
      VALUES('${id}', 'user', 'user@email.com.br', '${password}')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate a user.", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com.br",
      password: "1234",
    });

    const { user } = response.body;

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("user@email.com.br")
    expect(user.email).toEqual(user.email)
    expect(user).not.toBeUndefined()
  });

  it("Shouldn't be able to authenticate a non-existing user.", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "anotheruser@email.com",
      password: "anotherUserPassword",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual("Incorrect e-mail or password")
    expect(responseToken.body.token).toBe(undefined)
  });

  it("Shouldn't be able to authenticate user with incorrect password", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com.br",
      password: "654321",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual("Incorrect e-mail or password")
    expect(responseToken.body.token).toBe(undefined)
  });
});

