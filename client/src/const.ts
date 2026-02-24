export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Returns the login URL for the standalone auth flow.
 * No longer uses Manus OAuth portal.
 */
export const getLoginUrl = () => {
  return "/login";
};
