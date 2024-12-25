import { env } from "@/env.mjs";

const appUrl = env.NEXT_PUBLIC_APP_URL;
const accountsUrl = env.NEXT_PUBLIC_ACCOUNTS_URL;

export const getAuthUrl = ({
  redirectPath,
  searchParams,
}: {
  searchParams?: URLSearchParams;
  redirectPath: string;
}) => {
  const url = new URL(accountsUrl);
  url.pathname = "/login";
  const redirectUrl = new URL(appUrl);
  redirectUrl.pathname = redirectPath;

  /**
   * Append all searchParams to redirectUrl
   * so that, we don't lose track of the original url
   */
  if (searchParams) redirectUrl.search = searchParams.toString();

  /**
   * Append redirectUrl to accounts url
   * so that, after login, we redirect to the original page
   */
  url.searchParams.set("redirectUrl", redirectUrl.href);

  return url.toString();
};
