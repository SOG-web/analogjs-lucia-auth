import { getLoadResolver } from "@analogjs/router";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const adminGuard: CanActivateFn = async (route, state) => {
  const data: any = await getLoadResolver(route);
  console.log("admin guard", data);
  // const router = inject(Router);

  if (!data.sessionId) {
    // router.navigateByUrl("/login");
    console.log("admin guard no session id");
    return false;
  }

  return true;
};
