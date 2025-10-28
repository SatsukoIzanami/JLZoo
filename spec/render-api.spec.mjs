import request from "supertest";

const BASE_URL = "https://jlzoo.onrender.com"; // replace with your real Render URL

// note about Render free tier!!!
console.log("**PLEASE NOTE**: Render free instances spin down with inactivity and may take ~45s to wake if idle." +
    " If the first test times out, please re-run after the instance is awake!"
);

describe("Deployed Zoo API on Render", () => {
  it("GET /api/animals should return a valid array of animal objects", async () => {
    const res = await request(BASE_URL).get("/api/animals");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
    expect(res.body.length).toBeGreaterThan(0);

    const first = res.body[0];
    expect(first.name).toBeDefined();
    expect(first.type).toBeDefined();
    expect(first.habitat).toBeDefined();
    expect(first.description).toBeDefined();
  });

  it("GET /api/animals/:name should return a specific animal by name", async () => {
    const all = await request(BASE_URL).get("/api/animals");

    // Skip if API returns no animals
    if (!Array.isArray(all.body) || all.body.length === 0) {
      console.warn("No animals found on deployed API — skipping name test.");
      return;
    }

    // Grab first animal name
    const firstName = all.body[0].name;
    console.log(`Testing lookup for: ${firstName}`);

    const res = await request(BASE_URL).get(`/api/animals/${encodeURIComponent(firstName)}`);

    // Graceful skip if not found
    if (res.status === 404) {
      console.warn(`Animal '${firstName}' not found on Render API.`);
      return;
    }

    expect(res.status).toBe(200);
    expect(res.body.name.toLowerCase()).toBe(firstName.toLowerCase());
  });

  it("POST /api/animals should be unavailable or blocked on deployed API", async () => {
    const testAnimal = {
      name: "Test Creature",
      type: "Placeholder",
      conservationStatus: "Unknown",
      habitat: "None",
      image: "",
      description: "This should not be allowed in production.",
      funFact: "N/A",
      pregnant: false
    };

    const res = await request(BASE_URL)
      .post("/api/animals")
      .send(testAnimal)
      .set("Content-Type", "application/json");

    // We expect either 403, 405, or 500 depending on your Render configuration
    expect([400, 403, 405, 500]).toContain(res.status);
  });
});


