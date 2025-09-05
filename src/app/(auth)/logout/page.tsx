"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import apiRequest from "../apiRequest";

function LogoutLogic() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("token");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    apiRequest.logoutFromNextClientToNextServer(true, signal).then((res) => {
      router.push(`/login?redirectFrom=${pathname}`);
    });
  }, []);
  return <div>Logout</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  );
}
