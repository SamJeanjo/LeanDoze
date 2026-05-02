import { NextResponse } from "next/server";
import { resendInvite } from "@/lib/invite-service";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const result = await resendInvite(params.id);
  const status = result.success ? 200 : result.code === "UNAUTHORIZED" ? 401 : 404;

  return NextResponse.json(result, { status });
}

