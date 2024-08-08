import { PageServerLoad } from "@analogjs/router";
import { parseCookies } from "h3";

export const load = async ({
  params, // params/queryParams from the request
  req, // H3 Request
  res, // H3 Response handler
  fetch, // internal fetch for direct API calls,
  event, // full request event
}: PageServerLoad) => {
  const cookies = parseCookies(event);

  // console.log(cookies);
  return {
    loaded: true,
  };
};
