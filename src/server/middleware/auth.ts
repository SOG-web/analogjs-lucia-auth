import { verifyRequestOrigin } from "lucia";

import type { User, Session } from "lucia";
import { defineEventHandler, getHeader, getCookie, appendHeader } from "h3";
import { lucia } from "../utils/auth";

export default defineEventHandler(async (event) => {
  console.log("auth middleware");
  if (event.node.req.method !== "GET") {
    console.log("auth middleware not GET method");
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return event.node.res.writeHead(403).end();
    }
  }

  console.log(event.req.headers);
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    console.log("auth middleware no session id");
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  }
  if (!session) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }
  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
