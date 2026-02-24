export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Returns the login URL for the standalone auth flow.
 * Redirects to root where the Login component is rendered.
 */
export const getLoginUrl = () => {
  return "/";
};
