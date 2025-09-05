import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import envConfig from "@/config";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  const host = request.headers.get("host");
  const hostname = host?.split(':')[0] ?? envConfig.NEXT_PUBLIC_URL;
  const apiEndpoint = `http://${hostname}:8888/api`;

  const response = await fetch(
    apiEndpoint + "/emr/file/" + fileId,
    {
      headers: {
        Authorization: `Bearer ${sessionToken.value}`, // pass token if needed
      },
    }
  );

  if (!response.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const pdfBuffer = await response.arrayBuffer();
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=sample.pdf",
    },
  });
}
