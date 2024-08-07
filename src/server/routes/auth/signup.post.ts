import {
  createError,
  defineEventHandler,
  readFormData,
  appendHeader,
} from "h3";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "../../utils/auth";
import {
  checkEmail,
  checkPassword,
  hashPassword,
} from "../../utils/auth-utils";
import { client } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);
  const password = formData.get("password") || "";
  const email = formData.get("email") || "";

  if (!checkEmail(email)) {
    throw createError({
      message: "Invalid email",
      statusCode: 400,
    });
  }

  if (!checkPassword(password)) {
    throw createError({
      message: "Invalid password",
      statusCode: 400,
    });
  }

  const passwordHash = await hashPassword(password as string);
  const userId = generateIdFromEntropySize(10); // 16 characters long

  const newUser = await client.user.create({
    data: {
      id: userId,
      email: email as string,
      password: passwordHash,
    },
  });

  const session = await lucia.createSession(newUser.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );

  //@ts-ignore
  delete newUser.password;

  return {
    userId: newUser.id,
    user: newUser,
  };
});
