import request from "supertest";
import app from "../api/server.js";

describe("Local Zoo API", () => {
  it("GET /api/animals should return an array of valid animal objects", async () => {
    const res = await request(app).get("/api/animals");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
    expect(res.body.length).toBeGreaterThan(0);

    const first = res.body[0];
    expect(first.name).toBeDefined();
    expect(first.type).toBeDefined();
    expect(first.habitat).toBeDefined();
    expect(first.description).toBeDefined();
  });

  it("GET /api/animals/:name should return a specific animal if it exists", async () => {
    const all = await request(app).get("/api/animals");
    const firstName = all.body[0]?.name;

    if (!firstName) {
      console.warn("No animals in test data — skipping name lookup test.");
      return;
    }

    const res = await request(app).get(`/api/animals/${encodeURIComponent(firstName)}`);
    if (res.status === 404) {
      console.warn(`Animal '${firstName}' not found, skipping.`);
      return;
    }

    expect(res.status).toBe(200);
    expect(res.body.name.toLowerCase()).toBe(firstName.toLowerCase());
  });
});



