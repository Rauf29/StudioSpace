import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME || "studiospace");

const betterAuthUrl = (
  process.env.BETTER_AUTH_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  baseURL: betterAuthUrl,
  secret: process.env.BETTER_AUTH_SECRET || "studiospace_secret_key_jwt_2026",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    betterAuthUrl,
    "https://studiospace-drab.vercel.app",
  ],
  plugins: [
    jwt(),
  ],
});
