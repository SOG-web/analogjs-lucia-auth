import { User } from "@prisma/client";
import { OAuth2RequestError } from "arctic";
import {
  defineEventHandler,
  getQuery,
  getCookie,
  createError,
  appendHeader,
  sendRedirect,
} from "h3";
import { generateId } from "lucia";
import { github, lucia } from "../../../utils/auth";
import { client } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query["code"]?.toString() ?? null;
  const state = query["state"]?.toString() ?? null;
  const storedState = getCookie(event, "github_oauth_state") ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    console.log("Invalid state");
    throw createError({
      status: 400,
    });
  }

  try {
    console.log("Validating code");
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = (await client.user.findUnique({
      where: {
        github_id: githubUser.id,
      },
    })) as User | undefined;

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );
      return sendRedirect(event, "/");
    }

    const userId = generateId(15);
    const user = await client.user
      .create({
        data: {
          id: userId,
          github_id: githubUser.id,
          username: githubUser.login,
        },
      })
      .catch(() => {
        console.error("Failed to create user");
        throw createError({
          status: 500,
        });
      });

    const session = await lucia.createSession(userId, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
    return sendRedirect(event, "/");
  } catch (e) {
    console.log(e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      throw createError({
        status: 400,
      });
    }
    throw createError({
      status: 500,
    });
  }
});

interface GitHubUser {
  id: number;
  login: string;
  email: string;
}
