import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function RootPage(): ReactNode {
    redirect('/login');
    return null;
}