import { createError, defineEventHandler, readFormData } from "h3";
import { lucia } from "../../utils/auth";
import {
  checkEmail,
  checkPassword,
  verifyPassword,
} from "../../utils/auth-utils";
import { client } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);

  const email = formData.get("email") || "";
  const password = formData.get("password") || "";

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

  const user = await client.user.findUnique({
    where: {
      email: email as string,
    },
  });

  if (!user) {
    throw createError({
      message: "Invalid email or password",
      statusCode: 404,
    });
  }

  const passwordMatch = await verifyPassword(
    password as string,
    user.password as string,
  );

  if (!passwordMatch) {
    throw createError({
      message: "Invalid email or password",
      statusCode: 404,
    });
  }

  const session = await lucia.createSession(user.id, {});
});
