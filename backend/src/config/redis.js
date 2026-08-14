import { createClient } from "redis";

let redisClient;

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log("[redis] REDIS_URL not set, skipping connection.");
    return;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) => {
    console.log("[redis] Client error:", err.message);
  });

  redisClient.on("connect", () => {
    console.log("[redis] Connected successfully");
  });

  try {
    await redisClient.connect();
  } catch (error) {
    console.log("[redis] Failed to connect:", error.message);
  }
};

export const getRedisClient = () => redisClient;

export default {
  get isOpen() {
    return redisClient?.isOpen || false;
  },
  get: (...args) => redisClient?.get(...args),
  set: (...args) => redisClient?.set(...args),
  setEx: (...args) => redisClient?.setEx(...args),
  del: (...args) => redisClient?.del(...args),
};