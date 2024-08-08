import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { adapter } from "./db";
import { User } from "@prisma/client";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      githubId: attributes.github_id,
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "id">;
  }
}

const config = {
  githubClientId: process.env["GITHUB_CLIENT_ID"] || "Ov23li5st0w9qnfV3Muk",
  githubClientSecret:
    process.env["GITHUB_CLIENT_SECRET"] ||
    "a3a992d33bf1888063a7e2baede3a4b83157cbe7",
};

// console.log(config);

export const github = new GitHub(
  config.githubClientId,
  config.githubClientSecret,
);
