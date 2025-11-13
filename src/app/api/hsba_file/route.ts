import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getConfig } from "@/config.server";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const { NEXT_PUBLIC_API_ENDPOINT } = getConfig();

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  // const host = request.headers.get("host");
  // const hostname = host?.split(':')[0] ?? envConfig.NEXT_PUBLIC_URL;
  // const apiEndpoint = `http://${hostname}:8888/api`;
  // const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const filePahthUri = NEXT_PUBLIC_API_ENDPOINT + "/emr/file/" + fileId;
  logger.info("Get Emr File: ", filePahthUri);

  const response = await fetch(filePahthUri, {
    headers: {
      Authorization: `Bearer ${sessionToken.value}`, // pass token if needed
    },
  });

  if (!response.ok) {
    return new Response("Bad Request", { status: 400 });
  }

  const pdfBuffer = await response.arrayBuffer();
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=sample.pdf",
    },
  });
}
