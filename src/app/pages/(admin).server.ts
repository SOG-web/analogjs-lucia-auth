import { PageServerLoad } from "@analogjs/router";
import { getCookie } from "h3";
import { lucia } from "../../server/utils/auth";

export const load = async ({
  params, // params/queryParams from the request
  req, // H3 Request
  res, // H3 Response handler
  fetch, // internal fetch for direct API calls,
  event, // full request event
}: PageServerLoad) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? "";
  const { session, user } = await lucia.validateSession(sessionId);
  return {
    sessionId,
    session,
    user,
  };
};
