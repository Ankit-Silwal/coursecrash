import { randomBytes } from "crypto";
import { createClient } from "redis";

/* ------------------ REDIS SETUP ------------------ */

const redisClient = createClient({
  url: "redis://localhost:6379"
});

redisClient.on("error", (err) =>
{
  console.error("Redis error:", err);
});

/* ------------------ SESSION LOGIC ------------------ */

function generateSessionId()
{
  return randomBytes(32).toString("hex");
}

const SESSION_TTL = 60; // 1 minute for testing

async function createSession(userId, req)
{
  const sessionId = generateSessionId();

  const sessionData =
  {
    userId: userId.toString(),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL * 1000).toISOString(),
    ip: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown"
  };

  const sessionKey = `session:${sessionId}`;

  await redisClient.set(
    sessionKey,
    JSON.stringify(sessionData),
    { EX: SESSION_TTL }
  );

  const userSessionKey = `user:sessions:${userId}`;

  await redisClient.sAdd(userSessionKey, sessionId);
  await redisClient.expire(userSessionKey, SESSION_TTL);

  console.log("Session created:", sessionId);
  return sessionId;
}

/* ------------------ MOCK REQUEST ------------------ */

function mockRequest()
{
  return {
    ip: "127.0.0.1",
    get: (header) =>
    {
      if (header === "User-Agent")
      {
        return "Test Browser";
      }
      return null;
    }
  };
}

/* ------------------ RUN TEST ------------------ */

async function run()
{
  await redisClient.connect();

  const userId = "test-user-123";
  const req = mockRequest();

  const sessionId = await createSession(userId, req);

  // Inspect stored session
  const sessionKey = `session:${sessionId}`;
  const sessionData = await redisClient.get(sessionKey);

  console.log("\nStored session data:");
  console.log(JSON.parse(sessionData));

  // Inspect user sessions
  const userSessionKey = `user:sessions:${userId}`;
  const sessions = await redisClient.sMembers(userSessionKey);

  console.log("\nUser sessions:");
  console.log(sessions);

  console.log("\nTTL (seconds):", await redisClient.ttl(sessionKey));

  await redisClient.quit();
}

run().catch(console.error);
