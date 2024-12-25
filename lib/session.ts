import "server-only";

import { createAuthClient } from "@/utils/supabase/server";

export const getCurrentUser = async () => {
  const client = createAuthClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
};
