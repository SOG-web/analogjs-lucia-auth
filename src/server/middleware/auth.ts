import { verifyRequestOrigin } from "lucia";

import type { User, Session } from "lucia";
import {
  defineEventHandler,
  getHeader,
  getCookie,
  appendHeader,
  sendRedirect,
  getRequestURL,
} from "h3";
import { lucia } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname;

  if (pathname.includes("_analog")) {
    if (!pathname.includes("/admin")) {
      console.log(getRequestURL(event).pathname);
      console.log("auth middleware not admin");
      return;
    }
  }

  if (pathname.includes("/auth") && !pathname.includes("/auth/logout")) {
    console.log(pathname);
    console.log("auth middleware not api");
    return;
  }

  let sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  const authHeader = getHeader(event, "Authorization");

  if (authHeader) {
    const [type, token] = authHeader.split(" ");
    if (type === "Bearer") {
      sessionId = token;
    }
  }

  if (!sessionId) {
    console.log("auth middleware no session id");
    // sendRedirect(event, "/login");
    event.context.session = null;
    event.context.user = null;
    console.log(getRequestURL(event).pathname);
    if (pathname.includes("/api")) {
      return event.node.res.writeHead(403).end();
    }
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
    console.log("auth middleware no session");
    event.context.session = null;
    event.context.user = null;
    if (pathname.includes("/api")) {
      return event.node.res.writeHead(403).end();
    }
    return;
  }

  if (session && session.fresh) {
    console.log("auth middleware session fresh");
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
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
