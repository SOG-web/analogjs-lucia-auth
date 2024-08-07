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
  githubClientId: process.env["GITHUB_CLIENT_ID"] || "",
  githubClientSecret: process.env["GITHUB_CLIENT_SECRET"] || "",
};

export const github = new GitHub(
  config.githubClientId,
  config.githubClientSecret,
);
