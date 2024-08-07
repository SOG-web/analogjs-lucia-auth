import { hash, verify } from "@node-rs/argon2";

export const checkEmail = (email: any): boolean => {
  if (
    typeof email !== "string" ||
    email.length < 7 ||
    email.length > 31 ||
    !email.includes("@")
  ) {
    return false;
  }
  return true;
};

export const checkPassword = (password: any): boolean => {
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return false;
  }
  return true;
};

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};

export const verifyPassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return await verify(hashed, password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};
