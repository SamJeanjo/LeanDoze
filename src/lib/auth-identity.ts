import { auth } from "@clerk/nextjs/server";

type ClerkClaims = Record<string, unknown> & {
  email?: string;
  given_name?: string;
  family_name?: string;
  firstName?: string;
  lastName?: string;
  primary_email_address?: string;
};

function stringClaim(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function getAuthIdentity() {
  const authState = await auth();
  const userId = authState.userId;

  if (!userId) {
    return null;
  }

  const claims = (authState.sessionClaims ?? {}) as ClerkClaims;
  const email =
    stringClaim(claims.email) ??
    stringClaim(claims.primary_email_address) ??
    stringClaim(claims["email_address"]) ??
    `${userId}@leandoze.local`;
  const firstName = stringClaim(claims.given_name) ?? stringClaim(claims.firstName);
  const lastName = stringClaim(claims.family_name) ?? stringClaim(claims.lastName);

  return {
    userId,
    email: email.toLowerCase(),
    firstName,
    lastName,
  };
}
