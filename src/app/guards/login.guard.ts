import { getLoadResolver } from "@analogjs/router";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const loginGuard: CanActivateFn = async (route, state) => {
  const data: any = await getLoadResolver(route);
  console.log("login guard", data);
  // const router = inject(Router);

  if (data.sessionId) {
    // router.navigateByUrl("/login");
    console.log("you are already logged in");
    return false;
  }

  return true;
};
